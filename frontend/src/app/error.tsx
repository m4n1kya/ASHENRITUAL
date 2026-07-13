'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-heading text-[10rem] leading-none tracking-tighter text-border sm:text-[14rem]">
          500
        </p>
        <h1 className="mt-4 font-heading text-3xl uppercase tracking-widest text-foreground sm:text-5xl">
          Something Broke
        </h1>
        <p className="mx-auto mt-6 max-w-sm font-sans text-base text-muted-foreground">
          An error occurred. ASHENRITUAL demands precision — this moment fell short.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <button
            onClick={reset}
            className="group flex h-12 items-center gap-3 bg-foreground px-8 text-xs font-medium uppercase tracking-widest text-background transition-all hover:bg-foreground/90"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex h-12 items-center gap-3 border border-border px-8 text-xs font-medium uppercase tracking-widest text-foreground transition-all hover:bg-foreground/5"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
