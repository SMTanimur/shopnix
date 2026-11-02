'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { api, getStoredTokens } from '../lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const tokens = getStoredTokens();
    if (!tokens?.access_token) {
      setLoading(false);
      return;
    }

    api.auth
      .getMe()
      .then((res: any) => {
        const payload = res?.data || res;
        if (payload?.user && payload?.organization) {
          setAuth(payload.user, payload.organization);
        }
      })
      .catch((err: any) => {
        // Only trigger logout if server explicitly rejects with 401 Unauthorized
        if (err?.response?.status === 401) {
          logout();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAuth, logout, setLoading]);

  return <>{children}</>;
}
