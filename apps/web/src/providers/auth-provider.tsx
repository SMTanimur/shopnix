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
      .then((res) => {
        setAuth(res.user, res.organization);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setAuth, logout, setLoading]);

  return <>{children}</>;
}
