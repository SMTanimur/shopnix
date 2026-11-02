import type { User } from './user';
import type { Organization } from './organization';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number; // Seconds
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
  organization: Organization;
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  org_id: string;
  first_name: string;
  last_name: string;
  iat?: number;
  exp?: number;
}
