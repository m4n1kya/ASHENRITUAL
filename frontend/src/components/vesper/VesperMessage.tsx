import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { VesperRitualCard } from './VesperRitualCard';
import { VesperActionNav } from './VesperActionNav';
import type { VesperMessage as VesperMessageType } from '@/store/vesper.store';

export function VesperMessageComponent({ message }: { message: VesperMessageType }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8`}
    >
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
        
        {/* Author Label */}
        <div className={`font-heading text-[9px] font-bold uppercase tracking-[0.2em] mb-2 ${isUser ? 'text-[#8D8D8D]' : 'text-[#FDFCFB]'}`}>
          {isUser ? 'You' : 'Vesper'}
        </div>

        {/* Text Content */}
        {message.content && (
          <div className={`prose prose-invert max-w-none text-[12px] md:text-[13px] font-sans leading-relaxed ${isUser ? 'text-[#E8E8E8]' : 'text-[#A8A8A8]'} ${message.isStreaming ? 'animate-pulse' : ''}`}>
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        )}

        {/* Rich Components (only if model and not streaming text) */}
        {!isUser && message.recommendations && (
          <VesperRitualCard type={message.recommendations.type} recommendedProducts={message.recommendations.products} />
        )}

        {!isUser && message.actions && (
          <VesperActionNav actions={message.actions} />
        )}

      </div>
    </motion.div>
  );
}
