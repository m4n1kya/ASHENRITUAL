import { GeminiProvider } from './providers/gemini.provider';
import { ContextManager, VesperUserContext } from './tools/context.manager';
import { RecommendationEngine } from './tools/recommendation.engine';
import { ChatMessage, VesperStructuredResponse } from './providers/ai.provider.interface';
import { PrismaService } from '../prisma/prisma.service';
export declare class VesperOrchestrator {
    private geminiProvider;
    private contextManager;
    private recommendationEngine;
    private prisma;
    private readonly logger;
    private readonly SYSTEM_PROMPT;
    constructor(geminiProvider: GeminiProvider, contextManager: ContextManager, recommendationEngine: RecommendationEngine, prisma: PrismaService);
    chatStream(messages: ChatMessage[], context: VesperUserContext, userId?: string): AsyncGenerator<{
        type: string;
        content: string;
    } | {
        type: string;
        content: VesperStructuredResponse;
    }, void, unknown>;
    private logAnalytics;
}
