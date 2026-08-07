import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SanctumClient } from './SanctumClient';

export const metadata: Metadata = {
  title: 'SANCTUM — ASHENRITUAL',
  description: 'The private creator ecosystem and architectural library for future collections.',
};

export default function SanctumPage() {
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <SanctumClient />
      </Suspense>
    </main>
  );
}
