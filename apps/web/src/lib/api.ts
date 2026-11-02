import { createApiClient } from '@shopnix/api-client';
import type { AuthTokens } from '@shopnix/types';

const TOKEN_KEY = 'shopnix_auth_tokens';
export const COOKIE_ACCESS_NAME = 'shopnix_access_token';
export const COOKIE_REFRESH_NAME = 'shopnix_refresh_token';
export const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60; // 604,800 seconds (7 days validation)

/**
 * Read a cookie value by name in browser environments
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Set a cookie with path=/ and SameSite=Lax
 */
export function setCookie(name: string, value: string, maxAgeSeconds: number = SEVEN_DAYS_SECONDS): void {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

/**
 * Delete a cookie immediately
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Retrieve active auth tokens from localStorage or fallback to 7-day cookies
 */
export function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Try reading from localStorage first
    const raw = localStorage.getItem(TOKEN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.access_token) return parsed;
    }

    // 2. Fallback to 7-day browser cookies (recovering session across tabs/restarts)
    const accessToken = getCookie(COOKIE_ACCESS_NAME);
    const refreshToken = getCookie(COOKIE_REFRESH_NAME);

    if (accessToken) {
      const tokens: AuthTokens = {
        access_token: accessToken,
        refresh_token: refreshToken || '',
        token_type: 'Bearer',
        expires_in: SEVEN_DAYS_SECONDS,
      };
      // Keep localStorage in sync
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      return tokens;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Store auth tokens in both localStorage and 7-day browser cookies
 */
export function setStoredTokens(tokens: AuthTokens | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (tokens && tokens.access_token) {
      // 1. Store in localStorage
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

      // 2. Set 7-day browser cookies (enabling Next.js middleware and SSR checks)
      setCookie(COOKIE_ACCESS_NAME, tokens.access_token, SEVEN_DAYS_SECONDS);
      if (tokens.refresh_token) {
        setCookie(COOKIE_REFRESH_NAME, tokens.refresh_token, SEVEN_DAYS_SECONDS);
      }
    } else {
      // Clear both localStorage and browser cookies
      localStorage.removeItem(TOKEN_KEY);
      deleteCookie(COOKIE_ACCESS_NAME);
      deleteCookie(COOKIE_REFRESH_NAME);
    }
  } catch {
    // Ignore storage errors
  }
}

export const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  getTokens: getStoredTokens,
  setTokens: setStoredTokens,
  onUnauthorized: () => {
    setStoredTokens(null);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  },
});
