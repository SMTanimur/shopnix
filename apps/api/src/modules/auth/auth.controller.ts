import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  type LoginInput,
  type RegisterInput,
  type RefreshTokenInput,
} from '@shopnix/schemas';
import type { AuthenticatedUser } from '@shopnix/types';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly orgsService: OrganizationsService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new store owner and organization tenant' })
  @ApiResponse({ status: 201, description: 'Organization and user created successfully' })
  async register(@Body(new ZodValidationPipe(registerSchema)) input: RegisterInput) {
    const result = await this.authService.register(input);
    return { success: true, data: result };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and receive JWT tokens' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully' })
  async login(@Body(new ZodValidationPipe(loginSchema)) input: LoginInput) {
    const result = await this.authService.login(input);
    return { success: true, data: result };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and retrieve new access token' })
  async refresh(@Body(new ZodValidationPipe(refreshTokenSchema)) input: RefreshTokenInput) {
    const tokens = await this.authService.refreshTokens(input.refresh_token);
    return { success: true, data: tokens };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and store tenant' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const [userDoc, orgDoc] = await Promise.all([
      this.usersService.findById(user.userId),
      this.orgsService.findById(user.organizationId),
    ]);

    return {
      success: true,
      data: {
        user: {
          id: String(userDoc?._id),
          first_name: userDoc?.first_name,
          last_name: userDoc?.last_name,
          email: userDoc?.email,
          phone_number: userDoc?.phone_number,
          role: userDoc?.role,
          organization_id: String(userDoc?.organization_id),
        },
        organization: orgDoc,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke active refresh tokens and sign out' })
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.revokeRefreshToken(user.userId);
    return { success: true, message: 'Logged out successfully' };
  }
}
