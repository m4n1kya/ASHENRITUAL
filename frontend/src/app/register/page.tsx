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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

/* ── Inner form — must be inside Suspense because of useSearchParams ── */
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, isAuthenticated, _hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      router.replace(redirectTo);
    }
  }, [_hasHydrated, isAuthenticated, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      const res = await api.post<{ accessToken: string; user: { id: string; email: string; role: 'USER' | 'ADMIN' } }>(
        '/auth/register',
        { email: data.email, password: data.password },
      );
      setUser(res.user, res.accessToken);
      toast.success('Welcome to ASHENRITUAL.');
      const redirectTo = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
      router.push(redirectTo);
    } catch {
      toast.error('Registration failed.', {
        description: 'This email may already be in use.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm"
    >
      <div className="mb-10 text-center">
        <Link href="/" className="font-heading text-2xl tracking-[0.3em] text-foreground">
          ASHENRITUAL
        </Link>
        <h1 className="mt-6 font-heading text-3xl uppercase tracking-widest text-foreground">
          Join The Ritual
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your identity. Begin your wardrobe.
        </p>
      </div>

      {/* Google Auth Button (Primary) */}
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          setLoading(true);
          const redirect = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/';
          localStorage.setItem('ashen_redirect_url', redirect);
          window.location.href = 'http://localhost:4000/api/v1/auth/google'; // Assuming standard NestJS port
        }}
        className="group flex h-12 w-full items-center justify-center gap-4 bg-[#E8E8E8] text-xs font-medium uppercase tracking-[0.3em] text-[#0A0A0A] transition-all duration-500 hover:bg-white disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0A0A0A" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0A0A0A" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#0A0A0A" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0A0A0A" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#202020]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 font-heading text-[9px] uppercase tracking-[0.3em] text-[#8D8D8D]">
            Or
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {[
          { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', autoComplete: 'email' },
          { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••', autoComplete: 'new-password' },
          { name: 'confirmPassword', type: 'password', label: 'Confirm Password', placeholder: '••••••••', autoComplete: 'new-password' },
        ].map(({ name, type, label, placeholder, autoComplete }) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
              {label}
            </label>
            <input
              id={name}
              type={type}
              {...register(name as keyof RegisterFormData)}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={cn(
                'w-full border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1',
                errors[name as keyof RegisterFormData]
                  ? 'border-red-800 focus:ring-red-800'
                  : 'border-border focus:ring-foreground',
              )}
            />
            {errors[name as keyof RegisterFormData] && (
              <p className="mt-1 text-xs text-red-500">
                {errors[name as keyof RegisterFormData]?.message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-3 border border-[#202020] text-xs font-medium uppercase tracking-widest text-[#8D8D8D] transition-all hover:border-[#E8E8E8]/30 hover:text-foreground disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account with Email'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground hover:text-muted-foreground transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

/* ── Page — wraps form in Suspense (required by Next.js for useSearchParams) ── */
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-16">
      <Suspense fallback={
        <div className="w-full max-w-sm animate-pulse space-y-5">
          <div className="h-8 w-40 mx-auto bg-muted" />
          <div className="h-12 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
          <div className="h-12 w-full bg-muted" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
