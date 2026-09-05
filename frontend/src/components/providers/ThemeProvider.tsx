/**
 * @fileoverview ASHENRITUAL Architecture
 * @module ThemeProvider.tsx
 */
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme.store';

export function ThemeProvider() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    // Apply theme — always default to dark if somehow undefined
    const resolved = theme ?? 'dark';
    root.setAttribute('data-theme', resolved);
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}
