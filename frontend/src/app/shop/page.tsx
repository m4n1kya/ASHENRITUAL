import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopPageClient } from './ShopPageClient';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { Product, Category } from '@/types';

export const metadata: Metadata = {
  title: 'Shop — ASHENRITUAL',
  description: 'Refined. Intentional. Accord. The complete ASHENRITUAL collection.',
};

async function getInitialShopData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/products?page=1&limit=12`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } })
    ]);

    const productsData = productsRes.ok ? await productsRes.json() : { data: [], total: 0, totalPages: 1 };
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

    return {
      initialProducts: productsData.data || [],
      initialTotal: productsData.total || 0,
      initialTotalPages: productsData.totalPages || 1,
      initialCategories: categoriesData || []
    };
  } catch (err) {
    console.error('Failed to fetch initial shop data:', err);
    return {
      initialProducts: [],
      initialTotal: 0,
      initialTotalPages: 1,
      initialCategories: []
    };
  }
}

export default async function ShopPage() {
  const { initialProducts, initialCategories, initialTotal, initialTotalPages } = await getInitialShopData();

  return (
    <main className="min-h-screen bg-transparent texture-grain">
      <Suspense
        fallback={
          <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-16 lg:px-12">
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
        <ShopPageClient 
          initialProducts={initialProducts} 
          initialCategories={initialCategories}
          initialTotal={initialTotal}
          initialTotalPages={initialTotalPages}
        />
      </Suspense>
    </main>
  );
}
