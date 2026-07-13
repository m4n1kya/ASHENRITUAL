import { cn } from '@/lib/utils';

/* ─── Base Skeleton ──────────────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#141414]',
        className,
      )}
    />
  );
}

/* ─── Product Card Skeleton ──────────────────────────────────────────────── */

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image placeholder — 3:4 */}
      <Skeleton className="aspect-[3/4] w-full" />
      {/* Name */}
      <Skeleton className="h-3.5 w-3/4" />
      {/* Price */}
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

/* ─── Text Line Skeleton ─────────────────────────────────────────────────── */

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </div>
  );
}
