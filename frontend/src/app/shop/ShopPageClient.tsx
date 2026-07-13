'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Shirt, Box, SlidersHorizontal } from 'lucide-react';
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

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('q') || '';

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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        let url = '/products';
        if (selectedCategory) url = `/products/category/${selectedCategory}`;
        if (searchQuery) url = `/products?q=${encodeURIComponent(searchQuery)}`;
        const data = await api.get<Product[]>(url);
        if (!cancelled) {
          let sorted = [...data];
          if (selectedSort === 'price_asc') sorted.sort((a, b) => a.price - b.price);
          if (selectedSort === 'price_desc') sorted.sort((a, b) => b.price - a.price);
          setProducts(sorted);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedCategory, selectedSort, searchQuery]);

  useEffect(() => {
    api.get<Category[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  const handleScrollToGrid = () => {
    document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* ── HERO CURATION SECTION ────────────────────────────────────────────── */}
      <div className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden border-b border-[rgba(255,255,255,0.08)] bg-transparent py-20">
        
        <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col items-stretch justify-between gap-12 px-6 lg:flex-row lg:gap-8 lg:px-12">
          
          {/* Left Column - Typography (Overlapping Center) */}
          <div className="relative z-20 flex max-w-md flex-1 flex-col justify-center lg:-mr-32 xl:-mr-48">
            <h1 className="font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-[#F2F2F2] sm:text-5xl lg:text-[4rem] drop-shadow-md">
              Fashion changes,<br />but style endures.
            </h1>
            <p className="mt-6 font-sans text-lg font-light tracking-wide text-[#A8A8A8] lg:text-xl drop-shadow-md">
              A commitment to timeless pieces.
            </p>
          </div>

          {/* Center Column - Featured Piece */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="relative aspect-[3/4] w-full max-w-[400px] border border-[#202020] bg-background/40 p-4 backdrop-blur-sm lg:p-6">
              <div className="relative h-full w-full bg-card">
                <Image
                  src="/images/shop-hero-retro.jpg"
                  alt="Curated Piece"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Right Column - Collections & Curation */}
          <div className="flex max-w-sm flex-1 flex-col justify-center space-y-8 lg:ml-auto">
            {/* Collection Links */}
            <div className="space-y-4">
              {[
                { title: 'THE ESSENTIALS', icon: <Shirt strokeWidth={1} className="h-5 w-5" />, cat: 'shirts' },
                { title: 'ARCHITECTURAL FORM', icon: <Box strokeWidth={1} className="h-5 w-5" />, cat: 'outerwear' },
                { title: 'CURATED TEXTURES', icon: <SlidersHorizontal strokeWidth={1} className="h-5 w-5" />, cat: 'trousers' },
              ].map((block) => (
                <button
                  key={block.title}
                  onClick={() => {
                    updateParams({ category: block.cat });
                    handleScrollToGrid();
                  }}
                  className="group flex w-full flex-col justify-between border border-[rgba(255,255,255,0.08)] bg-card p-5 text-left transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[#141414]"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-sans text-[13px] font-medium tracking-wide text-[#F2F2F2]">
                      {block.title}
                    </span>
                    <span className="text-[#A8A8A8] transition-colors duration-[400ms] group-hover:text-[#F2F2F2]">
                      {block.icon}
                    </span>
                  </div>
                  <div className="mt-8 flex items-center gap-2 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#A8A8A8] transition-colors duration-[400ms] group-hover:text-[#F2F2F2]">
                    View Collection 
                    <ArrowRight className="h-3 w-3 transition-transform duration-[400ms] group-hover:translate-x-[6px]" />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleScrollToGrid}
              className="w-full border border-[rgba(255,255,255,0.08)] bg-transparent py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F2F2F2] transition-all duration-200 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              Explore the Manifesto
            </button>

            <div className="pt-8">
              <h3 className="mb-5 font-sans text-[11px] font-medium uppercase tracking-widest text-[#F2F2F2]">
                The Curation Process
              </h3>
              <ul className="space-y-3 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#A8A8A8]">
                <li className="flex items-center gap-4">
                  <div className="h-1 w-1 rounded-full bg-[#8D8D8D]" /> MATERIALITY
                </li>
                <li className="flex items-center gap-4">
                  <div className="h-1 w-1 rounded-full bg-[#8D8D8D]" /> CONSTRUCTION
                </li>
                <li className="flex items-center gap-4">
                  <div className="h-1 w-1 rounded-full bg-[#8D8D8D]" /> SILHOUETTE
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── DYNAMIC GRID ────────────────────────────────────────────────────── */}
      <div id="shop-grid" className="mx-auto max-w-screen-xl px-8 py-24 lg:px-12">
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
            {products.length} {products.length === 1 ? 'piece' : 'pieces'}
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </motion.div>
      )}
    </div>
  </div>
  );
}
