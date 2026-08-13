'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Shirt, Box, SlidersHorizontal, Search } from 'lucide-react';
import Image from 'next/image';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

/* Reference: "Shop — Refined. Intentional. Accord." header, horizontal
   category pills, filter/sort inline, grid of 4 with thin border gaps */

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export function ShopPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const filterKey = `${selectedCategory}|${selectedSort}|${searchQuery}`;
  const filterKeyRef = useRef(filterKey);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filterKey !== filterKeyRef.current) {
      filterKeyRef.current = filterKey;
      setPage(1);
    }
  }, [filterKey]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        let url = `/products?page=${page}&limit=12`;
        if (selectedCategory) url = `/products/category/${selectedCategory}?page=${page}&limit=12`;
        if (searchQuery) url = `/products?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=12`;

        const res = await api.get<{ data: Product[], total: number, totalPages: number }>(url);

        if (!cancelled) {
          const sorted = [...res.data];
          if (selectedSort === 'price_asc') sorted.sort((a, b) => a.price - b.price);
          if (selectedSort === 'price_desc') sorted.sort((a, b) => b.price - a.price);
          setProducts(prev => page === 1 ? sorted : [...prev, ...sorted]);
          setTotalPages(res.totalPages || 1);
          setTotalItems(res.total || 0);
        }
      } catch {
        if (!cancelled) {
          if (page === 1) { setProducts([]); setTotalItems(0); }
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedCategory, selectedSort, searchQuery, page]);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  const scrollToGrid = useCallback(() => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="w-full">

      {/* ── HERO CURATION SECTION ────────────────────────────────────────────── */}
      {!searchQuery && (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.03)] bg-[#050505]">
          <div className="absolute inset-0 z-0 bg-[#050505]">
            <Image 
              src="/images/shop-hero-new.jpg" 
              alt="Shop Hero" 
              fill 
              className="object-cover opacity-80" 
              priority 
              unoptimized 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-10" />
          </div>

          <div className="relative z-20 flex w-full max-w-screen-2xl flex-col items-start text-left px-6 lg:px-12">
            <h1 className="font-sans text-5xl font-bold leading-[1.1] tracking-tight text-[#FDFCFB] sm:text-6xl lg:text-[6rem] drop-shadow-2xl">
              Fashion changes,<br />but style endures.
            </h1>
            <p className="mt-8 font-display italic text-2xl text-[#E8E8E8] md:text-3xl">
              A commitment to timeless pieces.
            </p>
          </div>
        </div>
      )}

      {/* ── DYNAMIC GRID ────────────────────────────────────────────────────── */}
      <div id="shop-grid" ref={gridRef} className={cn("mx-auto max-w-screen-xl px-8 pb-24 lg:px-12", searchQuery ? "pt-12" : "pt-24")}>
        {/* Header inside grid */}
        <div className="mb-12">
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
            The Archive
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold uppercase tracking-[0.08em] text-[#E8E8E8] sm:text-4xl">
            {searchQuery
              ? `Results: "${searchQuery}"`
              : 'Shop'}
          </h2>
        </div>

      {/* ── Controls Bar — reference style ──────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#202020] pb-6">
        {/* Category filters — thin pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => updateParams({ category: '' })}
            className={cn(
              'px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] transition-all duration-300',
              !selectedCategory
                ? 'bg-[#E8E8E8] text-[#0A0A0A]'
                : 'border border-[#202020] text-[#8D8D8D] hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.slug })}
              className={cn(
                'px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] transition-all duration-300',
                selectedCategory === cat.slug
                  ? 'bg-[#E8E8E8] text-[#0A0A0A]'
                  : 'border border-[#202020] text-[#8D8D8D] hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center gap-6">
          <span className="text-[11px] text-[#8D8D8D]">
            {totalItems} {totalItems === 1 ? 'piece' : 'pieces'}
          </span>
          <div className="relative flex items-center">
            <select
              value={selectedSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="appearance-none border border-[#202020] bg-transparent py-1.5 pl-3 pr-7 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8D8D8D] focus:outline-none hover:border-[#E8E8E8]/30 transition-colors duration-300"
              aria-label="Sort"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-card">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-[#8D8D8D]" />
          </div>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-px bg-[#202020] md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-background p-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<span className="font-display text-4xl italic text-[#202020]">∅</span>}
          title="No pieces found"
          description="Adjust your filters or explore the full collection."
          action={{ label: 'Clear Filters', href: '/shop' }}
        />
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12"
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </motion.div>
          
          {/* Load More Button */}
          {page < totalPages && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loadingMore}
                className="flex h-12 w-48 items-center justify-center border border-[#202020] px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#E8E8E8] hover:bg-[#FDFCFB] hover:text-[#0A0A0A] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#E8E8E8] transition-all duration-500"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
  );
}
