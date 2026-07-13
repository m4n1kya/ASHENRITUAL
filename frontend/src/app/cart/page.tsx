'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { PageTransition } from '@/components/ui/PageTransition';

const EASE = [0.4, 0, 0.2, 1] as const;

/* Reference: "YOUR RITUAL — CART" — large heading, items list left,
   summary panel right, thin borders throughout */

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPrice());

  if (items.length === 0) {
    return (
      <PageTransition>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background pt-[60px]">
          <div className="text-center">
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
              Your Ritual
            </p>
            <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-7xl">
              Cart
            </h1>
            <p className="mt-6 text-[13px] text-[#8D8D8D]">
              Continue continue your ritual.
            </p>
            <Link
              href="/shop"
              className="group mt-10 inline-flex h-11 items-center gap-4 border border-[#202020] px-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8]"
            >
              Explore the Collection
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-[60px] texture-grain">
        <div className="mx-auto max-w-screen-xl px-8 py-16 lg:px-12">
          {/* Header */}
          <div className="mb-12">
            <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
              Your Ritual
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold uppercase tracking-[0.06em] text-[#E8E8E8] md:text-7xl">
              Cart
            </h1>
            <p className="mt-2 text-[13px] text-[#8D8D8D]">
              Continue continue your ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px]">
            {/* ── Items ─────────────────────────────────────────────────────────── */}
            <div>
              <AnimatePresence initial={false}>
                {items.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="border-b border-[#202020] py-6 first:border-t"
                  >
                    <div className="flex gap-6">
                      {/* Product image */}
                      <Link href={`/products/${product.id}`} className="relative h-28 w-20 shrink-0 overflow-hidden bg-card">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </Link>

                      {/* Info + controls */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/products/${product.id}`}>
                              <p className="text-[13px] font-medium text-[#E8E8E8] hover:text-[#8D8D8D] transition-colors duration-300">
                                {product.name}
                              </p>
                            </Link>
                            <p className="mt-1 text-[11px] text-[#8D8D8D]">
                              {product.category?.name}
                            </p>
                          </div>
                          <p className="text-[13px] font-medium text-[#E8E8E8]">
                            ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty stepper — thin, minimal */}
                          <div className="flex items-center border border-[#202020]">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center text-[#8D8D8D] transition-colors hover:text-[#E8E8E8]"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center text-[12px] text-[#E8E8E8]">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center text-[#8D8D8D] transition-colors hover:text-[#E8E8E8]"
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(product.id)}
                            className="flex h-8 w-8 items-center justify-center text-[#8D8D8D] transition-colors hover:text-[#E8E8E8]"
                            aria-label={`Remove ${product.name}`}
                          >
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Summary Panel ──────────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-24">
              <div className="border border-[#202020] bg-card p-8">
                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#E8E8E8]">
                  Summary
                </h2>

                <div className="mt-8 space-y-3 border-b border-[#202020] pb-6">
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#8D8D8D]">Subtotal</span>
                    <span className="text-[12px] text-[#E8E8E8]">{formatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#8D8D8D]">Shipping</span>
                    <span className="text-[12px] text-[#8D8D8D]">Calculated at checkout</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <span className="text-[13px] font-medium text-[#E8E8E8]">Total</span>
                  <span className="text-[13px] font-medium text-[#E8E8E8]">{formatted}</span>
                </div>

                {/* Proceed to checkout — primary button from reference */}
                <Link
                  href="/checkout"
                  className="group mt-8 flex h-11 w-full items-center justify-center gap-4 border border-[#E8E8E8]/20 text-[10px] font-medium uppercase tracking-[0.25em] text-[#E8E8E8] transition-all duration-500 hover:bg-[#E8E8E8] hover:text-[#0A0A0A]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>

                {/* Save Ritual link */}
                <p className="mt-4 text-center text-[10px] text-[#8D8D8D]">
                  <Link href="/saved-rituals" className="hover:text-[#E8E8E8] transition-colors duration-300 uppercase tracking-[0.2em]">
                    ◈ Save Ritual
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
