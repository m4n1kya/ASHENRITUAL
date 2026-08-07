'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { User } from '@/types';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type Form = z.infer<typeof schema>;

/* ── Inner form — must be inside Suspense because of useSearchParams ── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, isAuthenticated, _hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Client-side guard: if already logged in, redirect away
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      router.replace(redirectTo);
    }
  }, [_hasHydrated, isAuthenticated, router, searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string; user: User }>(
        '/auth/login', data,
      );
      setUser(res.user, res.accessToken);
      toast.success('Welcome back.');
      const redirectTo = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      router.push(redirectTo);
    } catch {
      toast.error('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-[360px]"
    >
      {/* Header */}
      <div className="mb-10 text-center">
        <Link href="/" className="font-heading text-[13px] font-semibold tracking-[0.3em] text-[#E8E8E8] transition-opacity hover:opacity-60">
          ASHENRITUAL
        </Link>
        <h1 className="mt-8 font-heading text-2xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">
          Sign In
        </h1>
        <p className="mt-2 text-[11px] text-[#8D8D8D]">
          Your wardrobe awaits.
        </p>
      </div>

      {/* Form (Primary) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {[
          { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', auto: 'email' },
          { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••', auto: 'current-password' },
        ].map(({ name, type, label, placeholder, auto }) => (
          <div key={name}>
            <label className="mb-2 block font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
              {label}
            </label>
            <input
              type={type}
              {...register(name as keyof Form)}
              placeholder={placeholder}
              autoComplete={auto}
              className={cn(
                'w-full border bg-transparent px-4 py-2.5 text-[12px] text-[#E8E8E8] placeholder:text-[#8D8D8D]/30',
                'focus:outline-none transition-colors duration-300',
                errors[name as keyof Form]
                  ? 'border-red-900/60 focus:border-red-700'
                  : 'border-[#202020] focus:border-[#E8E8E8]/30',
              )}
            />
            {errors[name as keyof Form] && (
              <p className="mt-1.5 text-[10px] text-red-500/80">
                {errors[name as keyof Form]?.message}
              </p>
            )}
            {name === 'password' && (
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-[9px] text-[#8D8D8D] transition-colors hover:text-[#E8E8E8]">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group mt-2 flex h-10 w-full items-center justify-center gap-4 border border-[#E8E8E8]/20 bg-transparent text-[10px] font-medium uppercase tracking-[0.3em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A] disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#202020]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-heading text-[9px] uppercase tracking-[0.3em] text-[#8D8D8D]">
            Or
          </span>
        </div>
      </div>

      {/* Google Auth Button (Secondary) */}
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          const redirect = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
          localStorage.setItem('ashen_redirect_url', redirect);
          window.location.href = `${API_URL}/auth/google`;
        }}
        className="group flex h-10 w-full items-center justify-center gap-4 border border-[#202020] bg-transparent text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8] disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
        </svg>
        Google
      </button>

      {/* Footer */}
      <p className="mt-10 text-center text-[11px] text-[#8D8D8D]">
        New to ASHENRITUAL?{' '}
        <Link href="/register" className="text-[#E8E8E8] transition-colors hover:text-[#8D8D8D]">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}

/* ── Page — wraps form in Suspense (required by Next.js for useSearchParams) ── */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-8 pb-16 pt-[160px] texture-grain">
      <Suspense fallback={
        <div className="w-full max-w-[360px] animate-pulse space-y-6">
          <div className="mx-auto h-4 w-32 bg-[#202020]" />
          <div className="h-8 w-48 mx-auto bg-[#202020]" />
          <div className="h-12 w-full bg-[#202020]" />
          <div className="h-12 w-full bg-[#202020]" />
          <div className="h-11 w-full bg-[#202020]" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
