import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopPageClient } from './ShopPageClient';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Shop — ASHENRITUAL',
  description: 'Refined. Intentional. Accord. The complete ASHENRITUAL collection.',
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-transparent pt-[60px] texture-grain">
      <Suspense
        fallback={
          <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
            <div className="mb-12">
              <div className="h-3 w-24 bg-[#202020] animate-pulse" />
              <div className="mt-4 h-10 w-48 bg-[#202020] animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <ShopPageClient />
      </Suspense>
    </main>
  );
}
