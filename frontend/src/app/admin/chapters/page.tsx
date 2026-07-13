'use client';

export default function AdminChaptersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">Chapters</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage curated collections.</p>
      </div>
      <div className="border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
        Chapter management will populate once the database is seeded.
      </div>
    </div>
  );
}
