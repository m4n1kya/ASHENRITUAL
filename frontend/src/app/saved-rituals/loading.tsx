/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function SavedRitualsLoading() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-16 lg:px-12">
        <div className="mb-12">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-12 w-64" />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
