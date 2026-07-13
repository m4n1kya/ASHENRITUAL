'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get<Product[]>(`/products?q=${encodeURIComponent(debouncedQuery)}`)
      .then((data) => { if (!cancelled) setProducts(data); })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Search Bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-6 py-6 lg:px-8">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pieces, materials, occasions..."
            className="w-full bg-transparent font-sans text-xl text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search products"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
        {!debouncedQuery ? (
          <div className="text-center py-20">
            <p className="font-heading text-3xl uppercase tracking-widest text-border">
              Begin Your Search
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Every piece in ASHENRITUAL awaits discovery.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Or browse all pieces
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No Results Found"
            description={`No pieces match "${debouncedQuery}". Try a different term.`}
            action={{ label: 'Browse All', href: '/shop' }}
          />
        ) : (
          <>
            <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
              {products.length} result{products.length !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
