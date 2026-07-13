'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { TrendingUp, Package, Users, ShoppingBag } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

const STAT_CARDS = [
  { key: 'totalRevenue',  label: 'Revenue',  icon: TrendingUp, format: (v: number) => `₹${v.toLocaleString('en-IN')}` },
  { key: 'totalOrders',   label: 'Orders',   icon: ShoppingBag, format: (v: number) => v.toString() },
  { key: 'totalUsers',    label: 'Customers', icon: Users, format: (v: number) => v.toString() },
  { key: 'totalProducts', label: 'Products', icon: Package, format: (v: number) => v.toString() },
] as const;

export default function AdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get<Stats>('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(setStats)
      .catch(() => setStats({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 }))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
          Control Panel
        </p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-[#FDFCFB] md:text-5xl">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-px bg-[#202020] lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, format }) => {
          const val = stats ? stats[key as keyof Stats] : 0;
          return (
            <div key={key} className="bg-background p-8">
              <div className="flex items-start justify-between">
                <p className="font-heading text-[9px] font-medium uppercase tracking-[0.3em] text-[#8D8D8D]">
                  {label}
                </p>
                <Icon className="h-4 w-4 text-[#3A3A3A]" strokeWidth={1.5} />
              </div>
              <p className="mt-4 font-heading text-2xl font-extrabold text-[#FDFCFB] md:text-3xl">
                {loading ? (
                  <span className="inline-block h-8 w-24 animate-pulse bg-[#1A1A1A]" />
                ) : format(val)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="mt-10 border border-[#202020] bg-card p-8">
        <p className="mb-6 font-heading text-[9px] font-semibold uppercase tracking-[0.35em] text-[#FDFCFB]">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Add Product',   href: '/admin/products/new' },
            { label: 'View Orders',   href: '/admin/orders' },
            { label: 'Customers',     href: '/admin/customers' },
            { label: 'Vesper Config', href: '/admin/vesper' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="flex h-10 items-center justify-center border border-[#202020] font-heading text-[9px] font-medium uppercase tracking-[0.25em] text-[#8D8D8D] transition-all duration-300 hover:border-[#FDFCFB]/20 hover:text-[#FDFCFB]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

