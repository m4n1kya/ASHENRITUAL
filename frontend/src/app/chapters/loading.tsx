/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ChaptersLoading() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* Header Skeleton */}
      <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-14 w-64 md:w-96 mb-6" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      {/* Chapter Grid Skeleton */}
      <div className="mx-auto max-w-screen-xl px-8 pb-24 lg:px-12 space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:grid md:grid-cols-2 border border-[#202020]">
            <div className={`relative aspect-[16/9] bg-[#1A1A1A] animate-pulse md:min-h-[480px] ${i % 2 === 0 ? "md:order-2" : ""}`} />
            <div className={`flex flex-col justify-between p-10 lg:p-14 ${i % 2 === 0 ? "md:order-1" : ""}`}>
              <div>
                <Skeleton className="h-3 w-32 mb-6" />
                <Skeleton className="h-10 w-3/4 mb-8" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <Skeleton className="h-4 w-32 mt-12" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
