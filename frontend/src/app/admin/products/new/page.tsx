'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be positive'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(productSchema) });

  async function onSubmit(data: ProductFormData) {
    if (!token) return;
    setSaving(true);
    try {
      await api.post(
        '/admin/products',
        {
          ...data,
          images: data.images
            ? data.images.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Product created.');
      router.push('/admin/products');
    } catch {
      toast.error('Could not create product.');
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { name: 'name', label: 'Product Name', placeholder: 'Matte Black Overshirt', type: 'text' },
    { name: 'description', label: 'Description', placeholder: 'A refined piece for the modern wardrobe...', type: 'textarea' },
    { name: 'price', label: 'Price (₹)', placeholder: '3999', type: 'number' },
    { name: 'stock', label: 'Stock', placeholder: '50', type: 'number' },
    { name: 'categoryId', label: 'Category ID', placeholder: 'UUID of category', type: 'text' },
    { name: 'images', label: 'Image URLs (comma-separated)', placeholder: 'https://...', type: 'text' },
  ] as const;

  return (
    <div>
      <Link
        href="/admin/products"
        className="group mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        Back to Products
      </Link>

      <h1 className="mb-8 font-heading text-3xl uppercase tracking-widest text-foreground">
        New Product
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
        {fields.map(({ name, label, placeholder, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground"
            >
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                {...register(name as keyof ProductFormData)}
                placeholder={placeholder}
                rows={4}
                className={cn(
                  'w-full resize-none border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1',
                  errors[name as keyof ProductFormData]
                    ? 'border-red-800 focus:ring-red-800'
                    : 'border-border focus:ring-foreground',
                )}
              />
            ) : (
              <input
                id={name}
                type={type}
                {...register(name as keyof ProductFormData)}
                placeholder={placeholder}
                className={cn(
                  'w-full border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1',
                  errors[name as keyof ProductFormData]
                    ? 'border-red-800 focus:ring-red-800'
                    : 'border-border focus:ring-foreground',
                )}
              />
            )}
            {errors[name as keyof ProductFormData] && (
              <p className="mt-1 text-xs text-red-500">
                {errors[name as keyof ProductFormData]?.message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="flex h-12 items-center gap-3 bg-foreground px-10 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
