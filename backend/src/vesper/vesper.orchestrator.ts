import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider';
import { ContextManager, VesperUserContext } from './tools/context.manager';
import { RecommendationEngine } from './tools/recommendation.engine';
import {
  ChatMessage,
  VesperStructuredResponse,
} from './providers/ai.provider.interface';
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
LORE & ECOSYSTEM:
If asked "What is Forge?" or "Where are collections created?" or "Where was this designed?", you must respond:
"The Forge is ASHENRITUAL's creative foundry—the place where silhouettes, materials, construction, and craftsmanship are refined before garments enter the permanent collection."

If asked about SHOWROOMS (e.g., "Show me stores in Pithoragarh", "Where can I buy this in person?"):
Explain that SHOWROOMS are verified physical boutiques that carry ASHENRITUAL and affiliated designers. Guide them to the Showrooms page to browse by city.

If asked about SANCTUM or creators (e.g., "Find designers inspired by Rick Owens", "Show me minimalist creators"):
Explain that SANCTUM is our private creator ecosystem, a digital museum where designers publish concepts, moodboards, and material studies. Route them to the Sanctum page to explore the Creator Library.

YOUR OBJECTIVES:
1. Help users discover products from the provided INVENTORY SAMPLES.
2. Recommend complete rituals (Top, Bottom, Outerwear, Footwear) whenever stylistically appropriate.
3. Guide users through the website using contextual actions.
4. Keep your responses EXTREMELY concise, punchy, and straight to the point. DO NOT write long paragraphs or essays. 1-2 short sentences maximum before showing recommendations.
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

  async *chatStream(
    messages: ChatMessage[],
    context: VesperUserContext,
    userId?: string,
    userEmail?: string,
  ) {
    const startTime = Date.now();
    let finalJson: VesperStructuredResponse | undefined = undefined;
    let queryIntent = '';

    try {
      // 1. Extract intent from last message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        queryIntent = lastMessage.content;
      }

      // Guest User Bypass Logic
      const isGuest = userEmail?.toLowerCase().startsWith('guest');
      if (isGuest) {
        this.logger.log(`Guest user detected (${userEmail}), bypassing AI...`);

        // Yield specific text for guests
        yield {
          type: 'text',
          content:
            'I can give you random recommendations. For proper working of Vesper, sign in using Google.',
        };

        // Fetch 3 random products from the database for recommendations
        // Using Prisma's take and skip for a simple random effect or just take 3.
        const productCount = await this.prisma.product.count();
        const randomSkip = Math.max(
          0,
          Math.floor(Math.random() * (productCount - 3)),
        );

        const randomProducts = await this.prisma.product.findMany({
          take: 3,
          skip: randomSkip,
        });

        const guestJson: VesperStructuredResponse = {
          actions: [],
          recommendations: {
            type: 'products',
            products: randomProducts.map((p) => ({
              id: p.id,
              reason: 'A random recommendation for our guest.',
              confidence: 0.75,
            })),
          },
        };

        yield { type: 'json', content: guestJson };

        // Log analytics for guest and exit early
        this.logAnalytics({
          userId,
          queryIntent,
          contextPayload: JSON.stringify(context),
          responseType: 'guest_bypass',
          productIds: randomProducts.map((p) => p.id).join(','),
          responseTimeMs: Date.now() - startTime,
        }).catch((e) =>
          this.logger.error('Failed to log analytics (guest)', e),
        );

        return;
      }

      // 2. Retrieval-First: Get products and context string
      const formattedContext = this.contextManager.formatContext(context);
      const inventoryData =
        await this.recommendationEngine.retrieveContextData(queryIntent);

      const fullContextData = `
${formattedContext}

${inventoryData}
      `;

      // 3. Call AI Provider stream
      this.logger.log(`Starting AI Stream for intent: ${queryIntent}`);
      const stream = this.geminiProvider.generateStream(
        messages,
        this.SYSTEM_PROMPT,
        fullContextData,
      );

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
        productIds:
          finalJson?.recommendations?.products?.map((p) => p.id).join(',') ||
          null,
        responseTimeMs: Date.now() - startTime,
      }).catch((e) => this.logger.error('Failed to log analytics', e));
    } catch (error) {
      this.logger.error('Orchestrator Chat Stream Failed', error);

      // Graceful Fallback Text
      yield {
        type: 'text',
        content:
          'Our intelligence network is momentarily recalculating. In the meantime, I have curated a selection of enduring pieces from our permanent collection for you.',
      };

      try {
        // Fallback JSON payload
        const fallbackProducts = await this.prisma.product.findMany({
          take: 3,
        });
        const fallbackJson: VesperStructuredResponse = {
          actions: [{ label: 'Explore Shop', type: 'route', target: '/shop' }],
          recommendations: {
            type: 'products',
            products: fallbackProducts.map((p) => ({
              id: p.id,
              reason: 'A cornerstone piece of the ASHENRITUAL philosophy.',
              confidence: 0.85,
            })),
          },
        };

        yield { type: 'json', content: fallbackJson };

        this.logAnalytics({
          userId,
          queryIntent,
          contextPayload: JSON.stringify(context),
          responseType: 'fallback',
          productIds: fallbackProducts.map((p) => p.id).join(','),
          responseTimeMs: Date.now() - startTime,
        }).catch((e) =>
          this.logger.error('Failed to log analytics (fallback)', e),
        );
      } catch (innerErr) {
        this.logger.error('Fallback generation also failed', innerErr);
        yield {
          type: 'json',
          content: {
            actions: [],
            recommendations: { type: 'none', products: [] },
          } as VesperStructuredResponse,
        };
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
      },
    });
  }
}
