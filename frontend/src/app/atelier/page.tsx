import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AtelierClient } from './AtelierClient';

export const metadata: Metadata = {
  title: 'Atelier — ASHENRITUAL',
  description: 'The creative studio and philosophy of ASHENRITUAL. Where silence becomes form.',
};

export default function AtelierPage() {
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <AtelierClient />
      </Suspense>
    </main>
  );
}
