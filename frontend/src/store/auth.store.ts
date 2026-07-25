'use client';

import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // ─── Actions ─────────────────────────────────────────────────────────────────
  setUser: (user: User, token: string) => void;
  setToken: (token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => {
    Cookies.set('isAuthenticated', 'true', { expires: 7 }); // 7 days
    set({ user, token, isAuthenticated: true });
  },

  setToken: (token) => 
    set({ token }),

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...partial } });
  },

  logout: () => {
    Cookies.remove('isAuthenticated');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
