/**
 * @fileoverview ASHENRITUAL Architecture
 * @module loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-16 lg:px-12">
        <div className="mb-12">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-12 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-[#111]" />
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="p-8 border border-[rgba(255,255,255,0.05)] bg-[#050505]">
              <Skeleton className="h-8 w-48 mb-8" />
              
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-12 w-full max-w-md bg-[#111]" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-12 w-full max-w-md bg-[#111]" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-12 w-full max-w-md bg-[#111]" />
                </div>
                <Skeleton className="h-12 w-32 mt-4 bg-[#222]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
