import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { User, UserDocument } from '../users/user.schema';
import { Organization, OrganizationDocument } from '../organizations/organization.schema';
import { UsersService } from '../users/users.service';
import type { LoginInput, RegisterInput } from '@shopnix/schemas';
import type { AuthResponse, AuthTokens, JwtPayload } from '@shopnix/types';
import { generateSlug } from '@shopnix/utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private redisClient: Redis | null = null;
  // In-memory fallback if Redis is unavailable during local standalone execution
  private tokenStoreFallback = new Map<string, { userId: string; expiresAt: number }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>,
    @InjectConnection() private connection: Connection,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.initRedis();
  }

  private initRedis() {
    try {
      const host = this.configService.get<string>('redis.host', 'localhost');
      const port = this.configService.get<number>('redis.port', 6379);
      const password = this.configService.get<string>('redis.password');

      this.redisClient = new Redis({
        host,
        port,
        password,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      this.redisClient.connect().catch(() => {
        this.logger.warn('Redis connection failed. Using in-memory store for refresh tokens.');
        this.redisClient = null;
      });
    } catch {
      this.redisClient = null;
    }
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('An account with this email address already exists');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const baseSlug = generateSlug(input.store_name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await this.orgModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const orgId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    const createdOrg = new this.orgModel({
      _id: orgId,
      name: input.store_name,
      slug: uniqueSlug,
      owner_id: userId,
      store_name: input.store_name,
      store_phone: input.phone_number,
      store_email: input.email.toLowerCase(),
      store_address: {
        address_line: 'Dhaka',
        city: 'Dhaka',
        zone: '',
        area: '',
      },
      subscription_plan: 'starter',
      subscription_status: 'trial',
      settings: {
        currency: 'BDT',
        currency_symbol: '৳',
        timezone: 'Asia/Dhaka',
        low_stock_alert_threshold: 5,
      },
    });

    const createdUser = new this.userModel({
      _id: userId,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email.toLowerCase(),
      password_hash: passwordHash,
      phone_number: input.phone_number,
      role: 'owner',
      organization_id: orgId,
      is_active: true,
    });

    // Check if MongoDB environment supports multi-document transactions (requires replica set)
    let session = null;
    let isTransactionActive = false;

    try {
      session = await this.connection.startSession();
      session.startTransaction();
      isTransactionActive = true;
    } catch (sessionErr) {
      // Standalone MongoDB does not support transactions; fallback gracefully
      this.logger.debug(
        `MongoDB transactions not supported on this instance (${(sessionErr as Error).message}). Using resilient sequential writes.`
      );
      if (session) {
        session.endSession();
        session = null;
      }
      isTransactionActive = false;
    }

    if (isTransactionActive && session) {
      try {
        await createdOrg.save({ session });
        await createdUser.save({ session });
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        this.logger.error(`Registration transaction failed: ${(error as Error).message}`);
        throw new BadRequestException((error as Error).message || 'Registration failed');
      } finally {
        session.endSession();
      }
    } else {
      // Resilient sequential save with compensating rollback
      try {
        await createdOrg.save();
        try {
          await createdUser.save();
        } catch (userSaveError) {
          // Compensating rollback: delete created organization if user persistence fails
          await this.orgModel.findByIdAndDelete(orgId).exec();
          throw userSaveError;
        }
      } catch (saveError) {
        this.logger.error(`Registration save failed: ${(saveError as Error).message}`);
        throw new BadRequestException((saveError as Error).message || 'Failed to complete registration');
      }
    }

    const tokens = await this.generateTokens(createdUser);

    return {
      tokens,
      user: this.mapUser(createdUser),
      organization: this.mapOrg(createdOrg),
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(input.email, true);
    if (!user || !user.is_active || user.deleted_at) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const organization = await this.orgModel.findById(user.organization_id).exec();
    if (!organization || organization.deleted_at) {
      throw new UnauthorizedException('Associated organization not found');
    }

    await this.usersService.updateLastLogin(user._id);
    const tokens = await this.generateTokens(user);

    return {
      tokens,
      user: this.mapUser(user),
      organization: this.mapOrg(organization),
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'dev-refresh-secret-key-shopnix-development',
      });

      const isValidToken = await this.validateStoredRefreshToken(payload.sub, refreshToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid or revoked refresh token');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.is_active || user.deleted_at) {
        throw new UnauthorizedException('User account inactive');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.del(`refresh_token:${userId}`);
    } else {
      this.tokenStoreFallback.delete(userId);
    }
  }

  private async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
      org_id: String(user.organization_id),
      first_name: user.first_name,
      last_name: user.last_name,
    };

    const accessSecret = this.configService.get<string>('jwt.secret') || 'dev-secret-key-shopnix-development-min-32-chars-long';
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret') || 'dev-refresh-secret-key-shopnix-development';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    await this.storeRefreshToken(String(user._id), refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900, // 15 mins
    };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;
    if (this.redisClient) {
      await this.redisClient.setex(`refresh_token:${userId}`, sevenDaysInSeconds, token);
    } else {
      this.tokenStoreFallback.set(userId, {
        userId,
        expiresAt: Date.now() + sevenDaysInSeconds * 1000,
      });
    }
  }

  private async validateStoredRefreshToken(userId: string, token: string): Promise<boolean> {
    if (this.redisClient) {
      const storedToken = await this.redisClient.get(`refresh_token:${userId}`);
      return storedToken === token;
    } else {
      const entry = this.tokenStoreFallback.get(userId);
      return !!entry && entry.expiresAt > Date.now();
    }
  }

  private mapUser(user: UserDocument) {
    return {
      id: String(user._id),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      organization_id: String(user.organization_id),
      is_active: user.is_active,
      last_login_at: user.last_login_at ? user.last_login_at.toISOString() : null,
      created_at: (user as unknown as { created_at: Date }).created_at?.toISOString() || new Date().toISOString(),
      updated_at: (user as unknown as { updated_at: Date }).updated_at?.toISOString() || new Date().toISOString(),
    };
  }

  private mapOrg(org: OrganizationDocument) {
    return {
      id: String(org._id),
      name: org.name,
      slug: org.slug,
      owner_id: String(org.owner_id),
      store_name: org.store_name,
      store_phone: org.store_phone,
      store_email: org.store_email,
      store_address: org.store_address,
      logo_url: org.logo_url,
      subscription_plan: org.subscription_plan,
      subscription_status: org.subscription_status,
      settings: org.settings,
      created_at: (org as unknown as { created_at: Date }).created_at?.toISOString() || new Date().toISOString(),
      updated_at: (org as unknown as { updated_at: Date }).updated_at?.toISOString() || new Date().toISOString(),
    };
  }
}
