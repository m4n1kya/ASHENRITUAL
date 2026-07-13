'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

/* ════════════════════════════════════════════════════════════════════════════
   PRODUCT CARD — Editorial Fashion Layout
   ─────────────────────────────────────────────────────────────────────────
   • Large image, small uppercase title, price
   • Minimal divider, thin borders, lots of whitespace
   • Hover: Image slowly zooms, Background slightly lifts, no shadows
   ════════════════════════════════════════════════════════════════════════════ */

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as number[] },
  },
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const [imgErr, setImgErr] = useState(false);

  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  const src = !imgErr && product.images?.[0] ? product.images[0] : '/images/product.png';

  return (
    <motion.article variants={cardVariants} className={cn('group', className)}>
      <Link
        href={`/products/${product.id}`}
        className="block border border-[rgba(255,255,255,0.08)] bg-transparent p-6 transition-colors duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(255,255,255,0.3)]"
        aria-label={`${product.name} — ${price}`}
      >
        {/* Image — 3:4 portrait, dark bg, cinematic hover zoom */}
        <div className="relative overflow-hidden bg-background aspect-[3/4]">
          <Image
            src={src}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.05]"
            onError={() => setImgErr(true)}
          />
          {/* Subtle hover dark veil */}
          <div className="absolute inset-0 bg-black/0 transition-[background-color] duration-700 group-hover:bg-black/10" />

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute left-0 top-0 bg-background/80 px-3 py-1.5">
              <span className="font-sans text-[8px] font-medium uppercase tracking-[0.35em] text-[#A8A8A8]">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Minimal Divider */}
        <div className="mt-8 h-[1px] w-full bg-[rgba(255,255,255,0.08)]" />

        {/* Product info — small uppercase title, lots of whitespace */}
        <div className="mt-6 flex flex-col space-y-2">
          <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F2F2F2]">
            {product.name}
          </h3>
          <p className="font-sans text-[11px] font-light text-[#A8A8A8]">
            {price}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
