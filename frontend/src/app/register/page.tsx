'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      const res = await api.post<{ access_token: string; user: { id: string; email: string; role: 'customer' | 'admin' } }>(
        '/auth/register',
        { email: data.email, password: data.password },
      );
      setUser(res.user, res.access_token);
      toast.success('Welcome to ASHENRITUAL.');
      router.push('/');
    } catch {
      toast.error('Registration failed.', {
        description: 'This email may already be in use.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 pt-16">
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
            className="flex h-12 w-full items-center justify-center gap-3 bg-foreground text-xs font-medium uppercase tracking-widest text-background transition-all hover:bg-foreground/90 disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground hover:text-muted-foreground transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
