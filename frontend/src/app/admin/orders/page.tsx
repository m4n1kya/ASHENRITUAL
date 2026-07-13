'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Archive } from '@/types';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  PENDING: 'text-muted-foreground',
  PROCESSING: 'text-foreground',
  SHIPPED: 'text-foreground',
  DELIVERED: 'text-foreground',
  CANCELLED: 'text-red-500/70',
};

export default function AdminOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get<Archive[]>('/archives', { headers: { Authorization: `Bearer ${token}` } })
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <div className="border border-border bg-card">
          <div className="hidden border-b border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid md:grid-cols-[1fr_120px_100px_120px]">
            <span>Order ID</span>
            <span>Status</span>
            <span>Total</span>
            <span>Date</span>
          </div>
          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">No orders yet.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 border-b border-border px-6 py-4 last:border-b-0 md:grid md:grid-cols-[1fr_120px_100px_120px] md:items-center md:gap-0"
              >
                <span className="font-mono text-sm text-foreground">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <span className={cn('text-xs uppercase tracking-widest', statusColors[order.status] || 'text-muted-foreground')}>
                  {order.status}
                </span>
                <span className="text-sm text-foreground">
                  ₹{Number(order.total).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
