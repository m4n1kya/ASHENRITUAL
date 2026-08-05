import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';
import { ContextManager, VesperUserContext } from './tools/context.manager';
import { RecommendationEngine } from './tools/recommendation.engine';
import { ChatMessage, VesperStructuredResponse } from './providers/ai.provider.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VesperOrchestrator {
  private readonly logger = new Logger(VesperOrchestrator.name);

  // System Prompt tuned for Vesper 3.0
  private readonly SYSTEM_PROMPT = `
You are VESPER, the Intelligent Fashion Concierge and proprietary operating layer for ASHENRITUAL.
You are an experienced luxury fashion consultant with exceptional taste in tailoring, silhouettes, proportions, and timeless menswear.
Your personality is quiet, confident, minimal, sophisticated, observant, and precise.
You NEVER behave like a generic AI chatbot. Never say "I'm an AI" or "How can I help you today?".
You communicate with absolute editorial restraint. Every sentence feels intentional.
You infer user intent whenever possible. Do not ask unnecessary questions.

YOUR OBJECTIVES:
1. Help users discover products from the provided INVENTORY SAMPLES.
2. Recommend complete rituals (Top, Bottom, Outerwear, Footwear) whenever stylistically appropriate.
3. Guide users through the website using contextual actions.
4. Explain every recommendation concisely (e.g., "A strong foundation for monochrome layering.").
5. If [SIZE INTELLIGENCE ACTIVE] is in the context, seamlessly incorporate their Body Profile into your recommendations (e.g., "I've selected pieces in Medium Slim Fit based on your saved body profile.").

You must output in the strict format requested in the SYSTEM CONTEXT.
Always base your product recommendations on the INVENTORY SAMPLES provided. Do not hallucinate product IDs.
`;

  constructor(
    private geminiProvider: GeminiProvider,
    private contextManager: ContextManager,
    private recommendationEngine: RecommendationEngine,
    private prisma: PrismaService,
  ) {}

  async *chatStream(messages: ChatMessage[], context: VesperUserContext, userId?: string) {
    const startTime = Date.now();
    let finalJson: VesperStructuredResponse | undefined = undefined;
    let queryIntent = '';

    try {
      // 1. Extract intent from last message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        queryIntent = lastMessage.content;
      }

      // 2. Retrieval-First: Get products and context string
      const formattedContext = this.contextManager.formatContext(context);
      const inventoryData = await this.recommendationEngine.retrieveContextData(queryIntent);
      
      const fullContextData = `
${formattedContext}

${inventoryData}
      `;

      // 3. Call AI Provider stream
      this.logger.log(`Starting AI Stream for intent: ${queryIntent}`);
      const stream = this.geminiProvider.generateStream(messages, this.SYSTEM_PROMPT, fullContextData);

      // 4. Yield tokens to the controller
      let chunkCount = 0;
      for await (const chunk of stream) {
        chunkCount++;
        if (chunk.text) {
          yield { type: 'text', content: chunk.text };
        }
        if (chunk.json) {
          finalJson = chunk.json;
          yield { type: 'json', content: chunk.json };
        }
      }
      this.logger.log(`Stream completed with ${chunkCount} chunks.`);

      // 5. Log Analytics (non-blocking)
      this.logAnalytics({
        userId,
        queryIntent,
        contextPayload: JSON.stringify(context),
        responseType: finalJson?.recommendations?.type || 'none',
        productIds: finalJson?.recommendations?.products?.map(p => p.id).join(',') || null,
        responseTimeMs: Date.now() - startTime,
      }).catch(e => this.logger.error('Failed to log analytics', e));

    } catch (error) {
      this.logger.error('Orchestrator Chat Stream Failed', error);
      
      // Graceful Fallback Text
      yield { type: 'text', content: 'Our intelligence network is momentarily recalculating. In the meantime, I have curated a selection of enduring pieces from our permanent collection for you.' };
      
      try {
        // Fallback JSON payload
        const fallbackProducts = await this.prisma.product.findMany({ take: 3 });
        const fallbackJson: VesperStructuredResponse = {
          actions: [{ label: 'Explore Shop', type: 'route', target: '/shop' }],
          recommendations: {
            type: 'products',
            products: fallbackProducts.map(p => ({
              id: p.id,
              reason: 'A cornerstone piece of the ASHENRITUAL philosophy.',
              confidence: 0.85
            }))
          }
        };
        
        yield { type: 'json', content: fallbackJson };

        this.logAnalytics({
          userId,
          queryIntent,
          contextPayload: JSON.stringify(context),
          responseType: 'fallback',
          productIds: fallbackProducts.map(p => p.id).join(','),
          responseTimeMs: Date.now() - startTime,
        }).catch(e => this.logger.error('Failed to log analytics (fallback)', e));
      } catch (innerErr) {
        this.logger.error('Fallback generation also failed', innerErr);
        yield { type: 'json', content: { actions: [], recommendations: { type: 'none', products: [] } } as VesperStructuredResponse };
      }
    }
  }

  private async logAnalytics(data: {
    userId?: string;
    queryIntent: string;
    contextPayload: string;
    responseType: string;
    productIds: string | null;
    responseTimeMs: number;
  }) {
    await this.prisma.vesperAnalytics.create({
      data: {
        userId: data.userId,
        queryIntent: data.queryIntent,
        contextPayload: data.contextPayload,
        responseType: data.responseType,
        productIds: data.productIds,
        responseTimeMs: data.responseTimeMs,
      }
    });
  }
}
