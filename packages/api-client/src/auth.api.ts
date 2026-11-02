import type { AxiosInstance } from 'axios';
import type { AuthResponse, AuthTokens, User, Organization } from '@shopnix/types';
import type { LoginInput, RegisterInput } from '@shopnix/schemas';

export class AuthApi {
  constructor(private client: AxiosInstance) {}

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await this.client.post<any>('/auth/login', input);
    return data?.data || data;
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await this.client.post<any>('/auth/register', input);
    return data?.data || data;
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await this.client.post<any>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data?.data || data;
  }

  async getMe(): Promise<{ user: User; organization: Organization }> {
    const { data } = await this.client.get<any>('/auth/me');
    return data?.data || data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }
}
