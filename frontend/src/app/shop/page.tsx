/**
 * @fileoverview ASHENRITUAL Architecture — Archival Shop
 * @module page.tsx
 */
import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import {
  ASHEN_CATEGORIES,
  filterAndSortCatalog,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop — ASHENRITUAL",
  description:
    "Refined. Intentional. Accord. The complete ASHENRITUAL collection.",
};

async function getInitialShopData() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/products?page=1&limit=12`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
      }).catch(() => null),
      fetch(`${API_URL}/categories`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
      }).catch(() => null),
    ]);
    clearTimeout(timeoutId);

    const productsData =
      productsRes && productsRes.ok ? await productsRes.json() : null;
    const categoriesData =
      categoriesRes && categoriesRes.ok ? await categoriesRes.json() : null;

    if (
      productsData &&
      Array.isArray(productsData.data) &&
      productsData.data.length > 0
    ) {
      return {
        initialProducts: productsData.data,
        initialTotal: productsData.total || productsData.data.length,
        initialTotalPages: productsData.totalPages || 1,
        initialCategories:
          categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0
            ? categoriesData
            : ASHEN_CATEGORIES,
      };
    }
  } catch (err) {
    console.warn("Shop: Backend API unreachable during SSR, using archival catalog.", err);
  }

  // Resilient fallback to verified archival catalog
  const fallback = filterAndSortCatalog({ page: 1, limit: 12, sort: "newest" });
  return {
    initialProducts: fallback.data,
    initialTotal: fallback.total,
    initialTotalPages: fallback.totalPages,
    initialCategories: ASHEN_CATEGORIES,
  };
}

export default async function ShopPage() {
  const {
    initialProducts,
    initialCategories,
    initialTotal,
    initialTotalPages,
  } = await getInitialShopData();

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
