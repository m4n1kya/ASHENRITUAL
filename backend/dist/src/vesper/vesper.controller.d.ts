import type { Request, Response } from 'express';
import { VesperOrchestrator } from './vesper.orchestrator';
import { ChatMessage } from './providers/ai.provider.interface';
import { VesperUserContext } from './tools/context.manager';
interface ChatDto {
    messages: ChatMessage[];
    context: VesperUserContext;
}
export declare class VesperController {
    private readonly orchestrator;
    constructor(orchestrator: VesperOrchestrator);
    chatStream(dto: ChatDto, req: Request, res: Response): Promise<void>;
}
export {};
