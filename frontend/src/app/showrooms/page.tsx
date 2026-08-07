import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShowroomsClient } from './ShowroomsClient';
import { Showroom } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SHOWROOMS — ASHENRITUAL',
  description: 'Discover verified menswear houses across India. Experience luxury fashion beyond conventional online shopping.',
};

async function getShowrooms(): Promise<Showroom[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  try {
    const res = await fetch(`${API_URL}/showrooms`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ShowroomsPage() {
  const showrooms = await getShowrooms();
  
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <ShowroomsClient initialShowrooms={showrooms} />
      </Suspense>
    </main>
  );
}
