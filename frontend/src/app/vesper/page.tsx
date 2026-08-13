'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock Vesper to dark mode for atmosphere
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute('data-theme') ?? 'dark';
    const prevClass = html.className;
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
    return () => {
      html.setAttribute('data-theme', prev);
      html.className = prevClass;
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
      toast.error('Sign in required', { description: 'Please sign in to talk to Vesper.' });
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
            localTime: new Date().toLocaleTimeString()
          }
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
            isStreaming: false
          });
        }
      );

      if (!hasReceivedData) {
        updateMessage(botMsgId, { 
          content: 'The intelligence layer did not respond. Please try again.',
          isStreaming: false 
        });
      } else {
        updateMessage(botMsgId, { isStreaming: false });
      }

    } catch (err) {
      console.error('Vesper Chat Error:', err);
      updateMessage(botMsgId, { 
        content: 'I am temporarily unable to access my intelligence network. Please try again later.',
        isStreaming: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const greeting = mounted ? (() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
  })() : '';

  const hasMessages = messages.length > 0;

  return (
    <main ref={containerRef} className="flex h-full flex-col bg-[#050505] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FDFCFB]/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#8D8D8D]" />
          <span className="font-heading text-[11px] uppercase tracking-[0.3em] text-[#8D8D8D]">Vesper</span>
        </div>
        {hasMessages && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={clearMessages}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#4A4A4A] hover:text-[#FDFCFB] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            New Chat
          </motion.button>
        )}
      </div>

      {/* Chat area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 md:px-8 hide-scrollbar">
        <div className="mx-auto max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center pt-20 md:pt-32 text-center"
              >
                {/* Animated orb */}
                <div className="relative mb-10">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 blur-md absolute inset-0"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="w-16 h-16 rounded-full bg-white/5 blur-xl absolute inset-0"
                  />
                  <div className="relative w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#8D8D8D]" />
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display italic text-3xl md:text-4xl text-[#FDFCFB] mb-3"
                >
                  {greeting}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-sans text-sm text-[#4A4A4A] mb-12"
                >
                  How can I help you today?
                </motion.p>

                {/* Quick prompts */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md"
                >
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent, prompt)}
                      className="text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] text-[#8D8D8D] hover:text-[#FDFCFB] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 leading-relaxed"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {messages.map(msg => (
                    <VesperMessageComponent key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-6" />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-20 shrink-0 px-4 pb-6 pt-3 md:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.form
            onSubmit={handleSubmit}
            animate={{
              boxShadow: focused
                ? '0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)'
                : '0 0 0 1px rgba(255,255,255,0.05), 0 8px 30px rgba(0,0,0,0.3)',
            }}
            transition={{ duration: 0.3 }}
            className="relative flex items-end gap-3 bg-[#111]/90 backdrop-blur-xl rounded-2xl p-3"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask Vesper anything..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-[#FDFCFB] placeholder:text-[#444] outline-none resize-none hide-scrollbar leading-relaxed"
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDFCFB] text-[#0A0A0A] disabled:opacity-30 disabled:bg-white/10 disabled:text-[#666] transition-all duration-300"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </motion.button>
          </motion.form>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.p
                key="loading"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-[9px] uppercase tracking-widest text-[#4A4A4A] mt-3"
              >
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Vesper is thinking...
                </motion.span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
