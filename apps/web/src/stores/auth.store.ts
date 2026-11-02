import { create } from 'zustand';
import type { User, Organization } from '@shopnix/types';
import { getStoredTokens, setStoredTokens } from '../lib/api';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  setAuth: (user: User, org: Organization) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  isAuthenticated: !!getStoredTokens()?.access_token,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrganization: (organization) => set({ organization }),
  setAuth: (user, organization) =>
    set({
      user,
      organization,
      isAuthenticated: true,
      isLoading: false,
    }),
  logout: () => {
    setStoredTokens(null);
    set({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
  setLoading: (isLoading) => set({ isLoading }),
}));
