'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Loader2, RefreshCw } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import { CalculatingBurst } from '@/components/ui/calculating-burst';
import { useAuthStore } from '@/store/auth.store';
import { useVesperStore, VesperMessage } from '@/store/vesper.store';
import { vesperApi } from '@/services/vesper.service';
import { VesperMessageComponent } from '@/components/vesper/VesperMessage';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export default function VesperChatPage() {
  const { token } = useAuthStore();
  const pathname = usePathname();
  const { messages, addMessage, updateMessage, clearMessages } = useVesperStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!token) {
      toast.error('Authentication Required', { description: 'Sign in to access Vesper Intelligence.' });
      return;
    }

    const userMsgId = 'user-' + Date.now();
    addMessage({ id: userMsgId, role: 'user', content: input });
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const botMsgId = 'vesper-' + Date.now();
    addMessage({ id: botMsgId, role: 'model', content: '', isStreaming: true });

    try {
      // Build conversation history for API
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: currentInput });

      let streamText = '';

      await vesperApi.chatStream(
        {
          messages: history,
          context: {
            currentPage: pathname,
            localTime: new Date().toLocaleTimeString()
          }
        },
        token,
        // onChunk (Text streaming)
        (textChunk) => {
          streamText += textChunk;
          updateMessage(botMsgId, { content: streamText });
        },
        // onJson (Structured data)
        (jsonData) => {
          updateMessage(botMsgId, {
            actions: jsonData.actions,
            recommendations: jsonData.recommendations,
            isStreaming: false
          });
        }
      );

      // Finalize streaming if no JSON arrived
      if (!streamText) {
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

  return (
    <main className="flex h-screen flex-col bg-background pt-16 texture-grain relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 to-background pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center justify-center py-6 border-b border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]/80 backdrop-blur-md shrink-0">
        <h1 className="font-heading text-lg font-bold uppercase tracking-[0.2em] text-[#FDFCFB]">
          Vesper
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-[#8D8D8D] mt-1">Intelligence Layer</p>
        
        {messages.length > 0 && (
          <button 
            onClick={clearMessages}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[#4A4A4A] hover:text-[#FDFCFB] transition-colors"
          >
            Clear Session
          </button>
        )}
      </header>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 md:px-12 hide-scrollbar">
        <div className="mx-auto max-w-3xl w-full">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center pt-32 opacity-70">
              <div className="w-12 h-[1px] bg-[#4A4A4A] mb-8" />
              <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-[#8D8D8D] text-center max-w-sm leading-relaxed">
                I am Vesper. Provide your context, and I will curate a precise, structural uniform tailored to your environment.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map(msg => (
                <VesperMessageComponent key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} className="h-20" />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-20 shrink-0 border-t border-[rgba(255,255,255,0.05)] bg-[#050505]/90 backdrop-blur-md p-6">
        <div className="mx-auto max-w-3xl relative rounded-[2rem]">
          <form onSubmit={handleSubmit} className="relative flex items-center bg-[#111]/80 backdrop-blur-xl transition-all duration-300 rounded-[2rem] p-2 shadow-2xl outline-none" tabIndex={-1}>
            <BorderBeam size={250} duration={12} delay={9} colorFrom="rgba(255,255,255,0.5)" colorTo="transparent" borderWidth={1.5} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consult Vesper..."
              className="flex-1 bg-transparent px-6 py-4 text-sm text-[#FDFCFB] placeholder:text-[#666] outline-none focus:outline-none focus:ring-0 border-none focus:border-transparent resize-none hide-scrollbar my-auto relative z-10"
              rows={1}
              style={{ maxHeight: '120px', boxShadow: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDFCFB] text-[#0A0A0A] disabled:opacity-50 disabled:bg-white/10 disabled:text-[#666] hover:bg-[#E8E8E8] hover:scale-105 transition-all duration-300 ml-2 relative z-10"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
            </button>
          </form>
        </div>
        <div className="mt-4 flex justify-center items-center min-h-[24px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <CalculatingBurst />
              </motion.div>
            ) : (
              <motion.p 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[9px] uppercase tracking-widest text-[#4A4A4A]"
              >
                Vesper Intelligence — Powered by Google Gemini
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
