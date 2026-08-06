import type { Request, Response } from 'express';
import { VesperOrchestrator } from './vesper.orchestrator';
import { VesperSizeService } from './vesper-size.service';
import type { SizeAnalysisRequest } from './vesper-size.service';
import { ChatMessage } from './providers/ai.provider.interface';
import { VesperUserContext } from './tools/context.manager';
interface ChatDto {
    messages: ChatMessage[];
    context: VesperUserContext;
}
export declare class VesperController {
    private readonly orchestrator;
    private readonly sizeService;
    constructor(orchestrator: VesperOrchestrator, sizeService: VesperSizeService);
    analyzeSize(dto: SizeAnalysisRequest): Promise<import("./vesper-size.service").SizeAnalysisResponse>;
    chatStream(dto: ChatDto, req: Request, res: Response): Promise<void>;
}
export {};
