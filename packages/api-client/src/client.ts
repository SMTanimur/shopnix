import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import type { AuthTokens } from '@shopnix/types';

export interface ApiClientConfig {
  baseURL: string;
  getTokens?: () => AuthTokens | null;
  setTokens?: (tokens: AuthTokens) => void;
  onUnauthorized?: () => void;
}

export class ShopnixApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(private config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor: Attach Access Token
    this.client.interceptors.request.use((reqConfig) => {
      const tokens = this.config.getTokens?.();
      if (tokens?.access_token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${tokens.access_token}`;
      }
      return reqConfig;
    });

    // Response Interceptor: Handle 401 & Refresh Token Rotation
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const currentTokens = this.config.getTokens?.();
            if (!currentTokens?.refresh_token) {
              throw new Error('No refresh token available');
            }

            const refreshResponse = await axios.post<any>(
              `${this.config.baseURL}/auth/refresh`,
              { refresh_token: currentTokens.refresh_token }
            );

            const newTokens: AuthTokens = refreshResponse.data?.data || refreshResponse.data;
            this.config.setTokens?.(newTokens);

            this.onRefreshed(newTokens.access_token);
            this.isRefreshing = false;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            this.config.onUnauthorized?.();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  public get axiosInstance(): AxiosInstance {
    return this.client;
  }
}
