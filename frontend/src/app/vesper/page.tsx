'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useVesperStore } from '@/store/vesper.store';
import { vesperApi } from '@/services/vesper.service';
import { VesperMessageComponent } from '@/components/vesper/VesperMessage';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const QUICK_PROMPTS = [
  'What should I wear tonight?',
  'Suggest a minimalist outfit',
  'Style me for a business meeting',
  'What pieces work for all seasons?',
];

export default function VesperChatPage() {
  const { token } = useAuthStore();
  const pathname = usePathname();
  const { messages, addMessage, updateMessage, clearMessages } = useVesperStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMounted(true), []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent, overrideInput?: string) => {
    e.preventDefault();
    const text = overrideInput ?? input;
    if (!text.trim() || isLoading) return;

    if (!token) {
      toast.error('Sign in to talk to Vesper.');
      return;
    }

    const userMsgId = 'user-' + Date.now();
    addMessage({ id: userMsgId, role: 'user', content: text });
    setInput('');
    setIsLoading(true);

    const botMsgId = 'vesper-' + Date.now();
    addMessage({ id: botMsgId, role: 'model', content: '', isStreaming: true });

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: text });

      let streamText = '';
      let hasReceivedData = false;

      await vesperApi.chatStream(
        {
          messages: history,
          context: {
            currentPage: pathname,
            localTime: new Date().toLocaleTimeString(),
          },
        },
        token,
        (textChunk) => {
          hasReceivedData = true;
          streamText += textChunk;
          updateMessage(botMsgId, { content: streamText });
        },
        (jsonData) => {
          hasReceivedData = true;
          updateMessage(botMsgId, {
            actions: jsonData.actions,
            recommendations: jsonData.recommendations,
            isStreaming: false,
          });
        }
      );

      updateMessage(botMsgId, {
        content: hasReceivedData ? streamText : 'Something went quiet. Please try again.',
        isStreaming: false,
      });
    } catch (err) {
      console.error('Vesper error:', err);
      updateMessage(botMsgId, {
        content: 'I am temporarily unreachable. Please try again shortly.',
        isStreaming: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const greeting = mounted
    ? (() => {
        const h = new Date().getHours();
        return h < 12 ? 'Good morning.' : h < 18 ? 'Good afternoon.' : 'Good evening.';
      })()
    : '';

  const hasMessages = messages.length > 0;

  return (
    <main className="flex h-full flex-col bg-[#050505] relative overflow-hidden">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[140px]" />
      </div>

      {/* Top identity bar — no border, no box */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-6 pb-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-3.5 w-3.5 text-[#8D8D8D]" />
          <span className="font-heading text-[11px] uppercase tracking-[0.35em] text-[#8D8D8D]">Vesper</span>
        </div>
        <AnimatePresence>
          {hasMessages && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              onClick={clearMessages}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#333] hover:text-[#8D8D8D] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              New Chat
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Message area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-8 py-4 hide-scrollbar">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              /* ── Welcome screen ── */
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-start justify-center pt-16 md:pt-24"
              >
                {/* Pulsing orb */}
                <div className="relative mb-8 ml-1">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 h-12 w-12 rounded-full bg-white/10 blur-lg"
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08]">
                    <Sparkles className="h-4 w-4 text-[#555]" />
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="font-display italic text-[2.5rem] leading-tight text-[#FDFCFB] mb-2"
                >
                  {greeting}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-sans text-sm text-[#444] mb-10"
                >
                  How can I help you today?
                </motion.p>

                {/* Quick prompts — ghost pills, no heavy border */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2"
                >
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        handleSubmit({ preventDefault: () => {} } as React.FormEvent, prompt)
                      }
                      className="px-4 py-2 rounded-full border border-white/[0.07] text-[11px] text-[#555] hover:text-[#FDFCFB] hover:border-white/20 transition-all duration-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* ── Message list ── */
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AnimatePresence>
                  {messages.map((msg) => (
                    <VesperMessageComponent key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input — floats at bottom, no box outline, subtle background */}
      <div className="relative z-20 shrink-0 px-8 pb-8 pt-2">
        <div className="max-w-2xl">
          <motion.form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-3 rounded-3xl bg-[#0E0E0E] px-5 py-3.5"
            style={{
              boxShadow: focused
                ? '0 0 0 1px rgba(255,255,255,0.08), 0 16px 50px rgba(0,0,0,0.6)'
                : '0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.4)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask Vesper anything..."
              className="flex-1 bg-transparent text-sm text-[#FDFCFB] placeholder:text-[#333] outline-none resize-none hide-scrollbar leading-relaxed"
              rows={1}
              style={{ maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDFCFB] text-[#0A0A0A] transition-all duration-300 disabled:opacity-20"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </motion.button>
          </motion.form>

          {/* Thinking indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-[9px] uppercase tracking-widest text-[#333]"
              >
                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Vesper is thinking…
                </motion.span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
