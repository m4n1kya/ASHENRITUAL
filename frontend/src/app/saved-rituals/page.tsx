'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton, ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';

interface SavedRitualItem {
  id: string;
  product: Product;
}

export default function SavedRitualsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const [saved, setSaved] = useState<SavedRitualItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login?redirect=/saved-rituals'); return; }
    api.get<SavedRitualItem[]>('/saved-rituals', { headers: { Authorization: `Bearer ${token}` } })
      .then(setSaved)
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, [token, router]);

  async function handleRemove(productId: string) {
    if (!token) return;
    try {
      await api.post('/saved-rituals/toggle', { productId }, { headers: { Authorization: `Bearer ${token}` } });
      setSaved((prev) => prev.filter((s) => s.product.id !== productId));
      toast.success('Removed from Saved Rituals.');
    } catch {
      toast.error('Could not remove item.');
    }
  }

  function handleAddToCart(product: Product) {
    addItem(product);
    toast.success(`${product.name} added to cart.`);
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
          <div className="mb-10">
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Your Collection</p>
            <h1 className="font-heading text-4xl uppercase tracking-tight text-foreground lg:text-6xl">
              Saved Rituals
            </h1>
            {!loading && (
              <p className="mt-2 text-sm text-muted-foreground">
                {saved.length} piece{saved.length !== 1 ? 's' : ''} saved.
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : saved.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-8 w-8" />}
              title="No Saved Rituals"
              description="Save pieces that speak to you. Your ritual evolves with every selection."
              action={{ label: 'Explore Pieces', href: '/shop' }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {saved.map(({ product }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-card">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-heading text-4xl text-border">AR</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{Number(product.price).toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                  {/* Quick actions */}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex flex-1 items-center justify-center gap-2 border border-border py-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      aria-label="Remove from saved"
                    >
                      <Heart className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
