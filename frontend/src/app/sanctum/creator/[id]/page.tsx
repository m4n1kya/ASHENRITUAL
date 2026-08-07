import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CreatorProfileClient } from './CreatorProfileClient';

export const metadata: Metadata = {
  title: 'Creator Exhibition — SANCTUM',
  description: 'Explore the digital fashion exhibition of this creator.',
};

export default async function CreatorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <main className="min-h-screen bg-background texture-grain">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="h-4 w-4 bg-[#202020] animate-ping rounded-full" />
          </div>
        }
      >
        <CreatorProfileClient creatorId={resolvedParams.id} />
      </Suspense>
    </main>
  );
}
