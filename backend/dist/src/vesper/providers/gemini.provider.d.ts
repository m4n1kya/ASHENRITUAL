import { AIProvider, ChatMessage, VesperStructuredResponse } from './ai.provider.interface';
export declare class GeminiProvider implements AIProvider {
    private readonly logger;
    private apiKey;
    constructor();
    generateStream(messages: ChatMessage[], systemPrompt: string, contextData: string): AsyncGenerator<{
        text?: string;
        json?: VesperStructuredResponse;
    }, void, unknown>;
}
