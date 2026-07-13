'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/ui/PageTransition';
import type { Metadata } from 'next';

interface VesperResponse {
  response: string;
}

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
      toast.error('Sign in to consult VESPER.', { description: 'Your wardrobe intelligence awaits.' });
      return;
    }

    const userMessage: Message = { role: 'user', content: finalQuery };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post<VesperResponse>(
        '/vesper/consult',
        { query: finalQuery },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages((prev) => [...prev, { role: 'vesper', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'vesper',
        content: 'VESPER is currently unavailable. Return shortly.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col bg-background pt-16">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12 lg:px-0">
          {/* Header */}
          <div className={cn('transition-all duration-700', hasMessages ? 'mb-8' : 'mb-16 mt-8')}>
            <p className="font-premium text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Wardrobe Intelligence
            </p>
            <h1 className={cn(
              'font-heading uppercase tracking-tight text-foreground transition-all duration-700',
              hasMessages ? 'text-3xl' : 'text-6xl lg:text-8xl',
            )}>
              VESPER
            </h1>
            {!hasMessages && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 max-w-md font-premium text-sm leading-relaxed text-muted-foreground"
              >
                VESPER observes. VESPER analyzes. VESPER refines. Share your occasion, and receive a wardrobe direction built on restraint.
              </motion.p>
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
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'max-w-[85%]',
                      msg.role === 'user' ? 'ml-auto' : 'mr-auto',
                    )}
                  >
                    {msg.role === 'vesper' && (
                      <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">VESPER</p>
                    )}
                    <div className={cn(
                      'p-5 font-premium text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'border border-border bg-card text-foreground',
                    )}>
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} className={line === '' ? 'h-3' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">VESPER is analyzing</p>
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Example prompts (shown when empty) */}
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
                  className="border border-border bg-transparent px-4 py-3 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input */}
          {token ? (
            <form onSubmit={handleSubmit} className="flex gap-3 border-t border-border pt-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe an occasion or ask for guidance..."
                className="flex-1 border-b border-border bg-transparent pb-3 font-premium text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Send to VESPER"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link href="/login" className="text-foreground hover:text-muted-foreground transition-colors">
                  Sign in
                </Link>{' '}
                to consult VESPER.
              </p>
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
}

