"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VesperOrchestrator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesperOrchestrator = void 0;
const common_1 = require("@nestjs/common");
const gemini_provider_1 = require("./providers/gemini.provider");
const context_manager_1 = require("./tools/context.manager");
const recommendation_engine_1 = require("./tools/recommendation.engine");
const prisma_service_1 = require("../prisma/prisma.service");
let VesperOrchestrator = VesperOrchestrator_1 = class VesperOrchestrator {
    geminiProvider;
    contextManager;
    recommendationEngine;
    prisma;
    logger = new common_1.Logger(VesperOrchestrator_1.name);
    SYSTEM_PROMPT = `
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
    constructor(geminiProvider, contextManager, recommendationEngine, prisma) {
        this.geminiProvider = geminiProvider;
        this.contextManager = contextManager;
        this.recommendationEngine = recommendationEngine;
        this.prisma = prisma;
    }
    async *chatStream(messages, context, userId, userEmail) {
        const startTime = Date.now();
        let finalJson = undefined;
        let queryIntent = '';
        try {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.role === 'user') {
                queryIntent = lastMessage.content;
            }
            const isGuest = userEmail?.toLowerCase().startsWith('guest');
            if (isGuest) {
                this.logger.log(`Guest user detected (${userEmail}), bypassing AI...`);
                yield {
                    type: 'text',
                    content: 'I can give you random recommendations. For proper working of Vesper, sign in using Google.',
                };
                const productCount = await this.prisma.product.count();
                const randomSkip = Math.max(0, Math.floor(Math.random() * (productCount - 3)));
                const randomProducts = await this.prisma.product.findMany({
                    take: 3,
                    skip: randomSkip,
                });
                const guestJson = {
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
                this.logAnalytics({
                    userId,
                    queryIntent,
                    contextPayload: JSON.stringify(context),
                    responseType: 'guest_bypass',
                    productIds: randomProducts.map((p) => p.id).join(','),
                    responseTimeMs: Date.now() - startTime,
                }).catch((e) => this.logger.error('Failed to log analytics (guest)', e));
                return;
            }
            const formattedContext = this.contextManager.formatContext(context);
            const inventoryData = await this.recommendationEngine.retrieveContextData(queryIntent);
            const fullContextData = `
${formattedContext}

${inventoryData}
      `;
            this.logger.log(`Starting AI Stream for intent: ${queryIntent}`);
            const stream = this.geminiProvider.generateStream(messages, this.SYSTEM_PROMPT, fullContextData);
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
            this.logAnalytics({
                userId,
                queryIntent,
                contextPayload: JSON.stringify(context),
                responseType: finalJson?.recommendations?.type || 'none',
                productIds: finalJson?.recommendations?.products?.map((p) => p.id).join(',') ||
                    null,
                responseTimeMs: Date.now() - startTime,
            }).catch((e) => this.logger.error('Failed to log analytics', e));
        }
        catch (error) {
            this.logger.error('Orchestrator Chat Stream Failed', error);
            yield {
                type: 'text',
                content: 'Our intelligence network is momentarily recalculating. In the meantime, I have curated a selection of enduring pieces from our permanent collection for you.',
            };
            try {
                const fallbackProducts = await this.prisma.product.findMany({
                    take: 3,
                });
                const fallbackJson = {
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
                }).catch((e) => this.logger.error('Failed to log analytics (fallback)', e));
            }
            catch (innerErr) {
                this.logger.error('Fallback generation also failed', innerErr);
                yield {
                    type: 'json',
                    content: {
                        actions: [],
                        recommendations: { type: 'none', products: [] },
                    },
                };
            }
        }
    }
    async logAnalytics(data) {
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
};
exports.VesperOrchestrator = VesperOrchestrator;
exports.VesperOrchestrator = VesperOrchestrator = VesperOrchestrator_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_provider_1.GeminiProvider,
        context_manager_1.ContextManager,
        recommendation_engine_1.RecommendationEngine,
        prisma_service_1.PrismaService])
], VesperOrchestrator);
//# sourceMappingURL=vesper.orchestrator.js.map