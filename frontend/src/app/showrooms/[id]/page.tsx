import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShowroomProfileClient } from './ShowroomProfileClient';

export const metadata: Metadata = {
  title: 'Showroom Profile — ASHENRITUAL',
  description: 'Explore verified luxury menswear showrooms.',
};

export default async function ShowroomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
        <ShowroomProfileClient showroomId={resolvedParams.id} />
      </Suspense>
    </main>
  );
}
