'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setUser(user, token);
        toast.success('Successfully authenticated.');
        
        // Redirect to a previously saved URL if any, otherwise to home
        const redirectTo = localStorage.getItem('ashen_redirect_url') || '/';
        localStorage.removeItem('ashen_redirect_url');
        router.replace(redirectTo);
      } catch (err) {
        toast.error('Authentication failed.');
        router.replace('/login');
      }
    } else {
      toast.error('Authentication failed.');
      router.replace('/login');
    }
  }, [searchParams, router, setUser, _hasHydrated]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-4"
    >
      <Loader2 className="h-6 w-6 animate-spin text-[#E8E8E8]" />
      <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-[#8D8D8D]">
        Authenticating...
      </p>
    </motion.div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background texture-grain">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#E8E8E8]" />
        </div>
      }>
        <AuthCallbackHandler />
      </Suspense>
    </main>
  );
}
