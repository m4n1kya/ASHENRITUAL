/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ChapterDetailLoading() {
  return (
    <main className="min-h-screen bg-background pb-32">
      {/* Navigation Bar Placeholder */}
      <div className="fixed top-0 left-0 w-full z-40 p-6 lg:p-12 pointer-events-none mt-16 lg:mt-0">
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] lg:h-[80vh] bg-[#050505] overflow-hidden flex items-end">
        <div className="w-full p-6 lg:p-24 z-10">
          <div className="max-w-screen-2xl mx-auto flex flex-col gap-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-16 w-3/4 max-w-2xl mb-4" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-24 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-4">
          <Skeleton className="h-3 w-24 mb-8" />
          <Skeleton className="h-10 w-full mb-4" />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-12">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>
    </main>
  );
}
