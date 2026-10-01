/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ShowroomsLoading() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-16 lg:px-12">
        {/* Header Skeleton */}
        <div className="mb-12 md:w-2/3">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-12 w-64 md:w-96 mb-6" />
          <Skeleton className="h-4 w-full max-w-lg mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-10 flex gap-4">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        {/* Showrooms Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col border border-[#202020] bg-card p-6">
              <Skeleton className="h-48 w-full mb-6 bg-[#1A1A1A]" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <Skeleton className="h-4 w-32 mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
