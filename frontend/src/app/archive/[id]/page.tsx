import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Archive } from '@/types';

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

interface ArchiveDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const { id } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  let order: Archive | null = null;
  try {
    const res = await fetch(`${API_URL}/archives/${id}`, {
      cache: 'no-store',
      // Note: In production, server would need the session token.
      // For now render the structure; auth is handled by middleware.
    });
    if (res.ok) order = await res.json();
  } catch { /* intentional */ }

  if (!order) {
    return (
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
          <Link href="/archive" className="group mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Archive
          </Link>
          <div className="text-center py-20">
            <p className="font-heading text-3xl uppercase tracking-widest text-muted-foreground">
              Order not found
            </p>
          </div>
        </div>
      </main>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
        <Link href="/archive" className="group mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Archive
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-muted-foreground">ORDER</p>
            <h1 className="font-heading text-4xl uppercase tracking-tight text-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <span className="font-heading text-3xl text-foreground">
            ₹{Number(order.total).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Status Tracker */}
        <div className="mb-12">
          <div className="flex items-center gap-0">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-3 w-3 ${i <= currentStep ? 'bg-foreground' : 'bg-border'}`} />
                  <span className={`text-[10px] uppercase tracking-widest whitespace-nowrap ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`h-px flex-1 ${i < currentStep ? 'bg-foreground' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-6 border border-border bg-card p-6">
              <div className="relative h-24 w-16 shrink-0 overflow-hidden bg-muted">
                {item.product?.images?.[0] && (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <Link href={`/products/${item.product?.id}`} className="font-medium text-foreground hover:text-muted-foreground transition-colors">
                    {item.product?.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-foreground">
                  ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
