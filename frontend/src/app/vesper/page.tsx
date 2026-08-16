'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, RotateCcw, Zap, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useVesperStore } from '@/store/vesper.store';
import { vesperApi } from '@/services/vesper.service';
import { VesperMessageComponent } from '@/components/vesper/VesperMessage';

const QUICK_PROMPTS = [
  'What should I wear tonight?',
  'Suggest a minimalist outfit',
  'Style me for a business meeting',
  'What works for all seasons?',
];

export default function VesperChatPage() {
  const { token, isAuthenticated, _hasHydrated } = useAuthStore();
  const { messages, addMessage, updateMessage, clearMessages } = useVesperStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    const userMsgId = Date.now().toString();
    const botMsgId = (Date.now() + 1).toString();

    addMessage({ id: userMsgId, role: 'user', content: text });
    setInput('');
    setIsLoading(true);

    addMessage({ id: botMsgId, role: 'model', content: '', isStreaming: true });

    try {
      // Build conversation history for the API
      const history = messages.map(m => ({ role: m.role as 'user' | 'model', content: m.content }));
      history.push({ role: 'user', content: text });

      let accumulated = '';

      await vesperApi.chatStream(
        {
          messages: history,
          context: {
            localTime: new Date().toLocaleString(),
          },
        },
        // Pass token if logged in; for guests pass an empty string and let the backend handle it
        token || '',
        (chunk: string) => {
          accumulated += chunk;
          updateMessage(botMsgId, { content: accumulated, isStreaming: true });
        },
        (jsonData) => {
          // Handle any structured JSON from vesper (actions, recommendations etc)
          const updates: Parameters<typeof updateMessage>[1] = { isStreaming: false };
          if (jsonData.recommendations) updates.recommendations = jsonData.recommendations;
          if (jsonData.actions) updates.actions = jsonData.actions;
          updateMessage(botMsgId, updates);
        }
      );

      // Mark streaming as done after stream completes
      updateMessage(botMsgId, { isStreaming: false });

    } catch (err: unknown) {
      const errMsg = typeof err === 'string' && err.includes('Session expired')
        ? 'Your session has expired. Please log in again.'
        : typeof err === 'string' && err.includes('401')
        ? 'Vesper requires an account. Please log in to continue.'
        : 'Vesper is temporarily unreachable. Please try again shortly.';

      updateMessage(botMsgId, { content: errMsg, isStreaming: false });
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

  // Show login prompt if not authenticated (after hydration)
  const showLoginBanner = _hasHydrated && !isAuthenticated;

  return (
    <main className="flex h-full flex-col bg-[#030303] relative overflow-hidden pt-[64px] md:pt-4">

      {/* Ambient background blobs & magical particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.012] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.008] blur-[100px]" />
        
        {/* Shiny magical particles */}
        {mounted && [...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 8px 1px rgba(255,255,255,0.4)',
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>



      {/* Login nudge banner (non-blocking) */}
      <AnimatePresence>
        {showLoginBanner && !hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative z-10 mx-auto max-w-2xl w-full px-6 mb-0"
          >
            <div className="flex items-center justify-between gap-3 border border-[rgba(255,255,255,0.05)] bg-white/[0.02] px-4 py-2.5 rounded-xl">
              <p className="text-[11px] text-[#4A4A4A]">Sign in for personalised styling, saved history &amp; full Vesper intelligence.</p>
              <Link href="/login?redirect=/vesper"
                className="shrink-0 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#FDFCFB] hover:text-[#8D8D8D] transition-colors font-heading">
                <LogIn className="w-3 h-3" /> Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message / welcome area */}
      <div className="relative z-10 flex-1 overflow-y-auto py-4 hide-scrollbar">
        <div className="w-full max-w-2xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-start pt-12 md:pt-16"
              >
                {/* Animated orb */}
                <div className="relative mb-10 ml-1">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.22, 0.08] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 w-16 h-16 rounded-full bg-white blur-xl -translate-x-2 -translate-y-2"
                  />
                  <div className="relative w-12 h-12 rounded-full border border-white/[0.06] flex items-center justify-center bg-white/[0.02]">
                    <Sparkles className="h-4 w-4 text-[#3A3A3A]" />
                  </div>
                </div>

                <motion.h1
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="font-display italic text-[3rem] leading-[1] text-[#FDFCFB] mb-3 tracking-tight"
                >
                  {greeting}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="font-sans text-[13px] text-[#333] mb-12 leading-relaxed"
                >
                  How can I help you today?
                </motion.p>

                {/* Quick prompts */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                  className="flex flex-col gap-2 w-full"
                >
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent, prompt)}
                      className="group flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-white/[0.04] hover:border-white/[0.1] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300"
                    >
                      <Zap className="h-3 w-3 text-[#2A2A2A] group-hover:text-[#6A6A6A] transition-colors shrink-0" />
                      <span className="text-[12px] text-[#3A3A3A] group-hover:text-[#9A9A9A] transition-colors">{prompt}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <VesperMessageComponent key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Input bar */}
      <div className="relative z-20 shrink-0 px-6 pb-8 pt-3">
        <div className="max-w-2xl mx-auto">

          {/* Thinking dots */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                className="mb-3 flex items-center gap-2 pl-2"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="block w-1 h-1 rounded-full bg-[#3A3A3A]"
                    />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#222]">Vesper is thinking</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-3 rounded-2xl px-5 py-4 overflow-hidden"
            style={{
              background: focused ? 'rgba(20,20,20,0.95)' : 'rgba(12,12,12,0.9)',
              boxShadow: focused
                ? '0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 0 0 1px rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.6)',
              transition: 'all 0.35s ease',
            }}
          >
            {/* Shine animation */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
              style={{ transform: 'skewX(-20deg)' }}
            />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask Vesper anything..."
              className="relative z-10 flex-1 bg-transparent text-[13px] text-[#FDFCFB] placeholder:text-[#2A2A2A] outline-none resize-none hide-scrollbar leading-relaxed tracking-wide"
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
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDFCFB] text-[#0A0A0A] transition-all duration-300 disabled:opacity-15 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </motion.button>
          </motion.form>

          <p className="text-center text-[9px] text-[#1A1A1A] mt-3 tracking-widest uppercase">
            Vesper may occasionally be imperfect. Verify important styling choices.
          </p>
        </div>
      </div>
    </main>
  );
}
