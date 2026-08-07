export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
export interface VesperAction {
    label: string;
    type: 'route' | 'product' | 'chapter' | 'collection' | 'forge' | 'showrooms' | 'sanctum' | 'beyond' | 'shop' | 'cart';
    target: string;
}
export interface VesperRecommendationProduct {
    id: string;
    reason: string;
    confidence: number;
}
export interface VesperStructuredResponse {
    actions?: VesperAction[];
    recommendations?: {
        type: 'ritual' | 'products' | 'none';
        products: VesperRecommendationProduct[];
    };
}
export interface AIProvider {
    generateStream(messages: ChatMessage[], systemPrompt: string, contextData: string): AsyncGenerator<{
        text?: string;
        json?: VesperStructuredResponse;
    }, void, unknown>;
}
