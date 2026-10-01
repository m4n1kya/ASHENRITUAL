/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ArchiveLoading() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-16 lg:px-12">
        <div className="mb-12">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-12 w-64" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border border-[rgba(255,255,255,0.05)] bg-[#050505] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-20 bg-[#111]" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex flex-col md:items-end gap-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
