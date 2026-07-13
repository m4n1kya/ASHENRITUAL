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
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Form) {
    setLoading(true);
    try {
      const res = await api.post<{ access_token: string; user: { id: string; email: string; role: 'customer' | 'admin' } }>(
        '/auth/login', data,
      );
      setUser(res.user, res.access_token);
      toast.success('Welcome back.');
      router.push('/');
    } catch {
      toast.error('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-8 pt-[60px] texture-grain">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[360px]"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="font-heading text-[13px] font-semibold tracking-[0.3em] text-[#E8E8E8] transition-opacity hover:opacity-60">
            ASHENRITUAL
          </Link>
          <h1 className="mt-8 font-heading text-3xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">
            Sign In
          </h1>
          <p className="mt-2 text-[12px] text-[#8D8D8D]">
            Your wardrobe awaits.
          </p>
        </div>

        {/* Form */}
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
                  'w-full border bg-transparent px-4 py-3 text-[13px] text-[#E8E8E8] placeholder:text-[#8D8D8D]/30',
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
            </div>
          ))}

          {/* Submit — reference primary button style */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-2 flex h-11 w-full items-center justify-center gap-4 border border-[#E8E8E8]/20 text-[10px] font-medium uppercase tracking-[0.3em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A] disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-10 text-center text-[11px] text-[#8D8D8D]">
          New to ASHENRITUAL?{' '}
          <Link href="/register" className="text-[#E8E8E8] transition-colors hover:text-[#8D8D8D]">
            Create an account
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
