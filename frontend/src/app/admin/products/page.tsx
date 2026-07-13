'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id: string) {
    if (!token || !confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted.');
    } catch {
      toast.error('Could not delete product.');
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} piece{products.length !== 1 ? 's' : ''} in inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-foreground px-6 py-2.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 border border-border bg-card px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="border border-border bg-card">
          {/* Header */}
          <div className="hidden border-b border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid md:grid-cols-[1fr_120px_100px_80px_80px]">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>
          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No products found.
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 border-b border-border px-6 py-4 last:border-b-0 md:grid md:grid-cols-[1fr_120px_100px_80px_80px] md:items-center md:gap-0"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-9 shrink-0 overflow-hidden bg-muted">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground font-mono">
                      {product.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.category?.name}
                </span>
                <span className="text-sm text-foreground">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className={cn(
                  'text-sm',
                  product.stock > 0 ? 'text-foreground' : 'text-red-500/70',
                )}>
                  {product.stock}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
