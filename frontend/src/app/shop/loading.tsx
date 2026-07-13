import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-14 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
