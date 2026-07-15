'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const EASE = [0.4, 0, 0.2, 1] as const;

interface Message {
  role: 'user' | 'vesper';
  content: string;
}

const EXAMPLE_QUERIES = [
  'I need an outfit for a formal dinner.',
  'What should I wear to a creative agency interview?',
  'Build me a capsule wardrobe for autumn.',
  'I need something minimal for travel.',
];

export default function VesperPage() {
  const { token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent | null, overrideQuery?: string) {
    e?.preventDefault();
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim() || loading) return;

    if (!token) {
      toast.error('Sign in to consult Vesper.', { description: 'The silent curator awaits.' });
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', content: finalQuery }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post<{ response: string }>(
        '/vesper/consult',
        { query: finalQuery },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, { role: 'vesper', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'vesper',
        content: 'Vesper is currently unavailable. Return shortly.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <main className="flex min-h-screen flex-col bg-background pt-16 texture-grain relative">
      
      {/* ── Background Texture ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
        <Image
          src="/images/natural-texture.jpg"
          alt="Natural Texture"
          fill
          className="object-cover"
          quality={100}
          unoptimized
        />
      </div>

      {/* Container is pushed to the right */}
      <div className="relative z-10 ml-auto mr-8 flex w-full max-w-2xl flex-1 flex-col py-16 md:mr-16 lg:mr-32 xl:mr-48">
        
        {/* Header - Left Aligned */}
        <div className={cn('transition-all duration-700 text-left flex flex-col items-start', hasMessages ? 'mb-8' : 'mb-20 mt-8')}>
          <p className="font-heading text-[10px] font-medium uppercase tracking-[0.35em] text-[#8D8D8D]">
            Wardrobe Intelligence
          </p>
          <h1 className={cn(
            'font-heading font-bold uppercase tracking-[0.05em] text-[#E8E8E8] transition-all duration-700',
            hasMessages ? 'mt-2 text-3xl' : 'mt-4 text-6xl lg:text-8xl',
          )}>
            Vesper
          </h1>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-start"
            >
              <p className="mt-6 max-w-md font-display text-xl font-light italic leading-relaxed text-[#E8E8E8]/50 md:text-2xl">
                How does form express intent?<br />
                Can a garment hold history?
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#8D8D8D]">
                Vesper observes. Vesper analyzes. Vesper refines.<br />
                Share your occasion, and receive a wardrobe direction built on restraint.
              </p>
            </motion.div>
          )}
        </div>

        {/* Messages */}
        {hasMessages && (
          <div className="mb-8 flex-1 space-y-6 overflow-y-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={cn('max-w-[85%]', msg.role === 'user' ? 'ml-auto text-right' : 'mr-auto text-left')}
                >
                  {msg.role === 'vesper' && (
                    <p className="mb-2 font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                      Vesper
                    </p>
                  )}
                  {msg.role === 'user' && (
                    <p className="mb-2 font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                      You
                    </p>
                  )}
                  <div className={cn(
                    'p-5 text-sm leading-relaxed text-left',
                    msg.role === 'user'
                      ? 'bg-[#E8E8E8] text-[#0A0A0A]'
                      : 'border border-[#202020] bg-card text-[#E8E8E8]',
                  )}>
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={line === '' ? 'h-3' : ''}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <p className="font-heading text-[9px] font-medium uppercase tracking-[0.4em] text-[#8D8D8D]">
                  Vesper is analyzing
                </p>
                <Loader2 className="h-3 w-3 animate-spin text-[#8D8D8D]" />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Prompts */}
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(null, q)}
                className="border border-[#202020] bg-transparent px-4 py-3 text-left text-[12px] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/20 hover:text-[#E8E8E8]"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input */}
        {token ? (
          <form onSubmit={handleSubmit} className="flex gap-3 border-t border-[#202020] pt-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe an occasion or ask for guidance..."
              className="flex-1 border-b border-[#202020] bg-transparent pb-3 text-sm text-[#E8E8E8] placeholder:text-[#8D8D8D]/40 focus:border-[#E8E8E8]/30 focus:outline-none transition-colors duration-500 text-left"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="flex h-10 w-10 items-center justify-center border border-[#202020] text-[#8D8D8D] transition-all duration-500 hover:border-[#E8E8E8]/30 hover:text-[#E8E8E8] disabled:opacity-20"
              aria-label="Send to Vesper"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="border-t border-[#202020] pt-6 text-left">
            <p className="text-sm text-[#8D8D8D]">
              <Link href="/login" className="text-[#E8E8E8] hover:text-[#8D8D8D] transition-colors duration-300">
                Sign in
              </Link>{' '}
              to consult Vesper.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

