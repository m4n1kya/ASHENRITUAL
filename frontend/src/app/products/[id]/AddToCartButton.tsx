"use client";

import { useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { SaveRitualButton } from "@/components/ui/SaveRitualButton";

/* Reference: "MOVE TO REVEAL" / "ADD TO CART" primary CTA button style */

export function AddToCartButtonServer({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock === 0;

  const SIZES = ["S", "M", "L", "XL"];

  async function handle() {
    if (outOfStock) return;
    if (!selectedSize) {
      toast.error("Select a size", {
        description: "Please specify your size before adding to ritual.",
      });
      return;
    }
    setAdded(true);
    addItem(product);
    toast.success(`${product.name}`, {
      description: `Size ${selectedSize} added to your ritual.`,
    });
    await new Promise((r) => setTimeout(r, 1500));
    setAdded(false);
  }

  return (
    <div className="w-full">
      {!outOfStock && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
              Size
            </span>
            <button className="font-heading text-[9px] font-medium uppercase tracking-[0.2em] text-[#8D8D8D] underline underline-offset-4 hover:text-[#E8E8E8] transition-colors">
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "border py-3 text-[10px] font-medium transition-all duration-300",
                  selectedSize === size
                    ? "border-[#E8E8E8] bg-[#E8E8E8] text-[#0A0A0A]"
                    : "border-[#202020] text-[#8D8D8D] hover:border-[#E8E8E8]/50 hover:text-[#E8E8E8]",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <SaveRitualButton
          productId={product.id}
          variant="full"
          className="flex-[0.5] h-14 px-4"
        />
        <button
          onClick={handle}
          disabled={outOfStock}
          aria-label={outOfStock ? "Sold out" : `Add ${product.name} to cart`}
          className={cn(
            "group flex h-14 flex-1 items-center justify-center gap-4 transition-all duration-500",
            "text-[10px] font-medium uppercase tracking-[0.3em]",
            outOfStock
              ? "border border-[#202020] text-[#8D8D8D] cursor-not-allowed"
              : added
                ? "bg-[#E8E8E8] text-[#0A0A0A]"
                : "border border-[#E8E8E8]/30 text-[#E8E8E8] hover:bg-[#E8E8E8] hover:text-[#0A0A0A]",
          )}
        >
          {added ? (
            "Added to Ritual"
          ) : outOfStock ? (
            "Sold Out"
          ) : (
            <>
              Add to Ritual
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Named export alias used in page.tsx
export { AddToCartButtonServer as AddToCartButton };
