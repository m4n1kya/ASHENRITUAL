import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';

/* Reference: Product detail — large image left with 4-grid thumbnails bottom,
   right panel has breadcrumb, huge product name, price, "MOVE TO REVEAL" CTA */

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getRelated(categoryId: string, currentId: string): Promise<Product[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  try {
    const res = await fetch(`${API_URL}/products?category=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter((p: Product) => p.id !== currentId).slice(0, 4);
  } catch { return []; }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product Not Found — ASHENRITUAL' };
  return {
    title: `${product.name} — ASHENRITUAL`,
    description: product.description,
    openGraph: { images: product.images?.[0] ? [product.images[0]] : [] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, id);

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <main className="min-h-screen bg-background pt-[60px] texture-grain">
      {/* ── Product Hero ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-xl px-8 py-12 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left — Images */}
          <div className="space-y-3">
            {/* Main image — large, no border */}
            <div className="relative aspect-[3/4] overflow-hidden bg-card">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-8xl font-semibold uppercase tracking-[0.2em] text-[#202020]">AR</span>
                </div>
              )}
            </div>

            {/* Thumbnail row — exactly 4 columns from reference */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square overflow-hidden bg-card">
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Related product thumbnails at bottom — reference shows 4 */}
            {related.length > 0 && (
              <div className="mt-6 border-t border-[#202020] pt-6">
                <p className="mb-4 font-heading text-[9px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
                  Complete the Chapter
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {related.map((p) => (
                    <Link key={p.id} href={`/products/${p.id}`} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-card">
                        {p.images?.[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="15vw"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-[10px] text-[#8D8D8D] group-hover:text-[#E8E8E8] transition-colors duration-300 truncate">{p.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col">
            {/* Breadcrumb — exact reference style */}
            <nav className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#8D8D8D]">
              <Link href="/shop" className="hover:text-[#E8E8E8] transition-colors duration-300">Shop</Link>
              <span className="text-[#202020]">/</span>
              <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-[#E8E8E8] transition-colors duration-300">
                {product.category?.name}
              </Link>
              <span className="text-[#202020]">/</span>
              <span className="text-[#E8E8E8] truncate max-w-[140px]">{product.name}</span>
            </nav>

            {/* Product name — large, reference style */}
            <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] leading-tight md:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="font-heading text-2xl font-medium text-[#E8E8E8]">
                ₹{Number(product.price).toLocaleString('en-IN')}.00
              </span>
              {avgRating && (
                <span className="text-[11px] text-[#8D8D8D]">
                  ★ {avgRating} ({product.reviews.length})
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-[#202020]" />

            {/* Description */}
            <p className="text-[13px] leading-relaxed text-[#8D8D8D]">
              {product.description}
            </p>

            <div className="my-8 h-px bg-[#202020]" />

            {/* Stock indicator */}
            <div className="mb-6 flex items-center gap-3">
              <span className={`h-1.5 w-1.5 ${product.stock > 0 ? 'bg-[#E8E8E8]' : 'bg-[#8D8D8D]'}`} />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
                {product.stock > 0 ? `${product.stock} available` : 'Sold Out'}
              </span>
            </div>

            {/* Add to Cart — reference: "MOVE TO REVEAL" style CTA with arrow */}
            <AddToCartButtonServer product={product} />

            <div className="my-8 h-px bg-[#202020]" />

            {/* Meta details */}
            <div className="space-y-3">
              {[
                { label: 'Category', value: product.category?.name },
                { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
                { label: 'Availability', value: product.stock > 0 ? 'In Stock' : 'Unavailable' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-[#202020]/40 pb-3">
                  <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">{label}</span>
                  <span className="text-[12px] text-[#E8E8E8]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews ───────────────────────────────────────────────────────────── */}
      {product.reviews?.length > 0 && (
        <section className="border-t border-[#202020]">
          <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">Perspectives</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold uppercase tracking-[0.1em] text-[#E8E8E8]">Reviews</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {product.reviews.map((review: { id: string; rating: number; comment?: string; user?: { email: string } }) => (
                <div key={review.id} className="border border-[#202020] bg-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-[11px] ${i < review.rating ? 'text-[#E8E8E8]' : 'text-[#202020]'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#8D8D8D] truncate ml-2 max-w-[120px]">
                      {review.user?.email?.split('@')[0]}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-[12px] leading-relaxed text-[#8D8D8D]">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

import { AddToCartButtonServer } from './AddToCartButton';
