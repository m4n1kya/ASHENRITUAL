/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function SanctumLoading() {
  return (
    <main className="min-h-screen bg-[#0E0E0E] text-[#FDFCFB] overflow-x-hidden pt-20">
      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 lg:px-12 pb-32">
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <Skeleton className="h-4 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-3/4 max-w-2xl mx-auto mb-6" />
          <Skeleton className="h-4 w-full max-w-xl mx-auto" />
          <Skeleton className="h-4 w-2/3 max-w-lg mx-auto mt-2" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full bg-[#1A1A1A]" />
          ))}
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group relative border border-[rgba(255,255,255,0.05)] bg-[#050505] p-6">
              <Skeleton className="absolute top-4 right-4 h-6 w-16" />
              <div className="flex flex-col items-center text-center mt-4">
                <Skeleton className="w-24 h-24 rounded-full mb-6 bg-[#1A1A1A]" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-20 mb-6" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
