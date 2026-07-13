import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-14 w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
