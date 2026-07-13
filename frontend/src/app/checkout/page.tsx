'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  street: z.string().min(5, 'Please enter a valid street address'),
  city: z.string().min(2, 'Please enter a city'),
  zip: z.string().min(4, 'Please enter a valid postal code'),
  country: z.string().min(2, 'Please enter a country'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) });

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPrice());

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-16">
        <div className="text-center">
          <p className="font-heading text-3xl uppercase tracking-widest text-muted-foreground">
            Your cart is empty.
          </p>
          <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-16">
        <div className="text-center">
          <p className="font-heading text-3xl uppercase tracking-widest text-muted-foreground">
            Sign in to continue.
          </p>
          <Link href="/login?redirect=/checkout" className="mt-4 inline-block text-xs uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: CheckoutFormData) {
    if (!token) return;
    setSubmitting(true);
    try {
      // First create address
      const address = await api.post<{ id: string }>(
        '/addresses',
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Then create archive (order)
      const order = await api.post<{ id: string }>(
        '/archives',
        {
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
          addressId: address.id,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      clearCart();
      toast.success('Order placed.', { description: 'Your ritual is confirmed.' });
      router.push(`/archive/${order.id}`);
    } catch (err) {
      toast.error('Could not place order.', {
        description: 'Please check your details and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
          <Link
            href="/cart"
            className="group mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Cart
          </Link>

          <h1 className="font-heading text-4xl uppercase tracking-tight text-foreground lg:text-6xl">
            Checkout
          </h1>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
              <div>
                <h2 className="mb-6 font-heading text-2xl uppercase tracking-widest text-foreground">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  {[
                    { name: 'street', label: 'Street Address', placeholder: '123 Architrave Way' },
                    { name: 'city', label: 'City', placeholder: 'Mumbai' },
                    { name: 'zip', label: 'Postal Code', placeholder: '400001' },
                    { name: 'country', label: 'Country', placeholder: 'India' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label htmlFor={name} className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
                        {label}
                      </label>
                      <input
                        id={name}
                        {...register(name as keyof CheckoutFormData)}
                        placeholder={placeholder}
                        className={cn(
                          'w-full border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1',
                          errors[name as keyof CheckoutFormData]
                            ? 'border-red-800 focus:ring-red-800'
                            : 'border-border focus:ring-foreground',
                        )}
                      />
                      {errors[name as keyof CheckoutFormData] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[name as keyof CheckoutFormData]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-3 bg-foreground text-xs font-medium uppercase tracking-widest text-background transition-all hover:bg-foreground/90 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div>
              <div className="border border-border bg-card p-8">
                <h2 className="font-heading text-xl uppercase tracking-widest text-foreground">
                  Your Order
                </h2>
                <div className="mt-6 space-y-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-muted">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                        )}
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-foreground text-[9px] text-background">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                      </div>
                      <span className="text-sm text-foreground">
                        ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="my-6 border-t border-border" />
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
