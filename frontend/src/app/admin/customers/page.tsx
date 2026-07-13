'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import type { User } from '@/types';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real system, there'd be an admin endpoint for listing users.
    // For now, we show the structure with mock fallback.
    setLoading(false);
    setUsers([]);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-foreground">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">User management and analytics.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <div className="border border-border bg-card">
          <div className="hidden border-b border-border px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid md:grid-cols-[1fr_120px_120px]">
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
          </div>
          {users.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Customer data will populate once the database is connected and users register.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-2 border-b border-border px-6 py-4 last:border-b-0 md:grid md:grid-cols-[1fr_120px_120px] md:items-center md:gap-0"
              >
                <span className="text-sm text-foreground">{user.email}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {user.role}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
