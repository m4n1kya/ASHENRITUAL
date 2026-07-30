'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  // ─── Actions ─────────────────────────────────────────────────────────────────
  setUser: (user: User, token: string) => void;
  setToken: (token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setUser: (user, token) => {
        Cookies.set('isAuthenticated', 'true', { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },

      setToken: (token) => set({ token }),

      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...partial } });
      },

      logout: () => {
        Cookies.remove('isAuthenticated');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ashen-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist auth state, not ephemeral UI flags
      partialize: (state: AuthStore) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
