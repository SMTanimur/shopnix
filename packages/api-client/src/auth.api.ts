import type { AxiosInstance } from 'axios';
import type { AuthResponse, AuthTokens, User, Organization } from '@shopnix/types';
import type { LoginInput, RegisterInput } from '@shopnix/schemas';

export class AuthApi {
  constructor(private client: AxiosInstance) {}

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/login', input);
    return data;
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await this.client.post<AuthResponse>('/auth/register', input);
    return data;
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await this.client.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data;
  }

  async getMe(): Promise<{ user: User; organization: Organization }> {
    const { data } = await this.client.get<{ user: User; organization: Organization }>('/auth/me');
    return data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }
}
