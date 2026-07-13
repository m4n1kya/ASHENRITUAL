'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import type { Archive } from '@/types';
import { PackageOpen, LogOut, ArrowRight } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PENDING: 'text-muted-foreground',
  PROCESSING: 'text-foreground',
  SHIPPED: 'text-foreground',
  DELIVERED: 'text-foreground',
  CANCELLED: 'text-red-500/70',
};

export default function ArchivePage() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login?redirect=/archive'); return; }
    api.get<Archive[]>('/archives', { headers: { Authorization: `Bearer ${token}` } })
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token, router]);

  function handleLogout() {
    logout();
    toast.success('Signed out.');
    router.push('/');
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
          {/* Profile Header */}
          <div className="mb-12 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-4xl uppercase tracking-tight text-foreground lg:text-5xl">
                Archive
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/account"
                className="border border-border px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:bg-foreground/5 transition-colors"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-border px-5 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Orders */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<PackageOpen className="h-8 w-8" />}
              title="No Orders Yet"
              description="Your archive is empty. Begin your ritual."
              action={{ label: 'Shop Now', href: '/shop' }}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border bg-card p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={cn('text-xs uppercase tracking-widest', statusColors[order.status] || 'text-muted-foreground')}>
                        {order.status}
                      </span>
                      <span className="font-medium text-foreground">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/archive/${order.id}`}
                        className="group flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Details
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                  {/* Product thumbnails */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 flex gap-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div key={item.id} className="relative h-14 w-10 overflow-hidden bg-muted">
                          {item.product?.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex h-14 w-10 items-center justify-center border border-border">
                          <span className="text-xs text-muted-foreground">+{order.items.length - 4}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
