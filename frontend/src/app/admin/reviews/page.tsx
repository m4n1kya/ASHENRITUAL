'use client';

export default function AdminReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Moderate and manage customer reviews.</p>
      </div>
      <div className="border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        Reviews will appear here once customers submit them.
      </div>
    </div>
  );
}
