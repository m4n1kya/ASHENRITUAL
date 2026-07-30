'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WebIcon } from '@/components/ui/WebIcon';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SaveRitualButtonProps {
  productId: string;
  className?: string;
  variant?: 'icon' | 'full';
}

export function SaveRitualButton({ productId, className, variant = 'icon' }: SaveRitualButtonProps) {
  const router = useRouter();
  const { token, _hasHydrated } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // Optimistic UI for toggle

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!_hasHydrated) return;

    if (!token) {
      toast.error('Authentication required', {
        description: 'Please sign in to save rituals.',
        action: {
          label: 'Sign In',
          onClick: () => router.push('/login'),
        }
      });
      return;
    }

    setSaving(true);
    try {
      await api.post('/saved-rituals/toggle', { productId }, { headers: { Authorization: `Bearer ${token}` } });
      setSaved((prev) => !prev);
      toast.success(saved ? 'Removed from your rituals.' : 'Added to your rituals.');
    } catch {
      toast.error('Failed to update ritual.');
    } finally {
      setSaving(false);
    }
  }

  if (variant === 'full') {
    return (
      <button
        onClick={handleToggle}
        disabled={saving}
        className={cn(
          "flex h-11 items-center justify-center gap-3 border border-[rgba(255,255,255,0.08)] bg-transparent px-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8E8E8] transition-all duration-300 hover:border-[#8D8D8D] disabled:opacity-50",
          saved && "bg-[rgba(255,255,255,0.05)]",
          className
        )}
      >
        <WebIcon className={cn("h-4 w-4", saved ? "fill-[#E8E8E8]" : "")} />
        {saved ? 'Saved Ritual' : 'Save Ritual'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-background/50 backdrop-blur-md transition-colors hover:bg-background disabled:opacity-50 border border-border/50",
        className
      )}
      aria-label="Save ritual"
    >
      <WebIcon className={cn("h-[14px] w-[14px] transition-colors", saved ? "fill-[#FDFCFB] text-[#FDFCFB]" : "text-[#8D8D8D] hover:text-[#FDFCFB]")} />
    </button>
  );
}
