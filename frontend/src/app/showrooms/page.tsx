import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShowroomsClient } from './ShowroomsClient';

export const metadata: Metadata = {
  title: 'SHOWROOMS — ASHENRITUAL',
  description: 'Discover verified menswear houses across India. Experience luxury fashion beyond conventional online shopping.',
};

export default function ShowroomsPage() {
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <ShowroomsClient />
      </Suspense>
    </main>
  );
}
