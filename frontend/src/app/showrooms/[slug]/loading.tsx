/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ShowroomDetailLoading() {
  return (
    <main className="w-full bg-background min-h-screen pb-32">
      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-40 p-6 lg:p-12 pointer-events-none mt-16 lg:mt-0">
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      {/* Hero */}
      <div className="relative w-full h-[60vh] lg:h-[80vh] bg-[#050505] overflow-hidden flex items-end">
        <div className="w-full p-6 lg:p-24 z-10">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-16 w-3/4 max-w-lg mb-4" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-24 mt-24">
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32 border-b border-[rgba(255,255,255,0.05)] pb-32">
          <div className="lg:col-span-4">
            <Skeleton className="h-3 w-24 mb-8" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-11/12 mb-2" />
              <Skeleton className="h-6 w-4/5" />
            </div>
            <Skeleton className="h-48 w-full bg-[#050505]" />
          </div>
        </section>
      </div>
    </main>
  );
}
