'use client';

import { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

/* Reference: "MOVE TO REVEAL" / "ADD TO CART" primary CTA button style */

export function AddToCartButtonServer({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock === 0;

  async function handle() {
    if (outOfStock) return;
    setAdded(true);
    addItem(product);
    toast.success(`${product.name}`, {
      description: 'Added to your ritual.',
    });
    await new Promise((r) => setTimeout(r, 1500));
    setAdded(false);
  }

  return (
    <button
      onClick={handle}
      disabled={outOfStock}
      aria-label={outOfStock ? 'Sold out' : `Add ${product.name} to cart`}
      className={cn(
        'group flex h-12 w-full items-center justify-center gap-4 transition-all duration-500',
        'text-[10px] font-medium uppercase tracking-[0.3em]',
        outOfStock
          ? 'border border-[#202020] text-[#8D8D8D] cursor-not-allowed'
          : added
          ? 'bg-[#E8E8E8] text-[#0A0A0A]'
          : 'border border-[#E8E8E8]/30 text-[#E8E8E8] hover:bg-[#E8E8E8] hover:text-[#0A0A0A]',
      )}
    >
      {added ? (
        'Added to Ritual'
      ) : outOfStock ? (
        'Sold Out'
      ) : (
        <>
          Add to Ritual
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

// Named export alias used in page.tsx
export { AddToCartButtonServer as AddToCartButton };
