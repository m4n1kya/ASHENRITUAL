import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { Product } from '@/types';

interface RecommendationProduct {
  id: string;
  reason: string;
  confidence: number;
}

export function VesperRitualCard({ type, recommendedProducts }: { type: 'ritual' | 'products' | 'none', recommendedProducts: RecommendationProduct[] }) {
  const [products, setProducts] = useState<(Product & { reason: string, confidence: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all products to get their details. We can map them locally.
        // In a real optimized system, we would have a specific endpoint `GET /products?ids=...`
        const res = await api.get<{ data: Product[] }>('/products?limit=100');
        const catalog = res.data || [];
        
        const hydrated = recommendedProducts.map(rp => {
          const match = catalog.find(p => p.id === rp.id);
          return match ? { ...match, reason: rp.reason, confidence: rp.confidence } : null;
        }).filter(Boolean) as (Product & { reason: string, confidence: number })[];
        
        setProducts(hydrated);
      } catch (e) {
        console.error('Failed to fetch recommended products', e);
      } finally {
        setLoading(false);
      }
    }
    
    if (recommendedProducts.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [recommendedProducts]);

  if (loading) {
    return (
      <div className="flex gap-4 animate-pulse">
        <div className="h-24 w-16 bg-white/5"></div>
        <div className="flex-1 space-y-2 py-2">
          <div className="h-2 w-24 bg-white/5"></div>
          <div className="h-2 w-full bg-white/5"></div>
          <div className="h-2 w-3/4 bg-white/5"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      {type === 'ritual' && (
        <div className="font-heading text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8D8D8D] mb-4">
          Complete Ritual Recommended
        </div>
      )}
      
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col md:flex-row gap-4 border border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]/50 p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors"
        >
          <div className="relative h-24 w-16 bg-[#111] overflow-hidden shrink-0">
            {p.images?.[0] && (
              <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="64px" unoptimized />
            )}
          </div>
          
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <div className="flex justify-between items-start gap-4">
                <Link href={`/products/${p.id}`} className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#FDFCFB] hover:text-[#A8A8A8] transition-colors truncate">
                  {p.name}
                </Link>
                <span className="font-mono text-[10px] text-[#8D8D8D] whitespace-nowrap">₹ {Number(p.price).toLocaleString('en-IN')}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#A8A8A8]">
                {p.reason}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#4A4A4A]">
                Confidence: {(p.confidence * 100).toFixed(0)}%
              </span>
              <div className="flex gap-4">
                <Link href={`/products/${p.id}`} className="text-[10px] uppercase tracking-widest text-[#8D8D8D] hover:text-[#FDFCFB] transition-colors">
                  View
                </Link>
                {/* Note: Add to cart logic would go here via Zustand store */}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
