import { Controller, Post, Body, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import type { Request, Response } from 'express';
import { VesperOrchestrator } from './vesper.orchestrator';
import { VesperSizeService } from './vesper-size.service';
import type { SizeAnalysisRequest } from './vesper-size.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatMessage } from './providers/ai.provider.interface';
import { VesperUserContext } from './tools/context.manager';

interface ChatDto {
  messages: ChatMessage[];
  context: VesperUserContext;
}

@Controller('vesper')
export class VesperController {
  constructor(
    private readonly orchestrator: VesperOrchestrator,
    private readonly sizeService: VesperSizeService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('analyze-size')
  @HttpCode(200)
  async analyzeSize(@Body() dto: SizeAnalysisRequest) {
    return this.sizeService.analyzeProportions(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  @HttpCode(200)
  async chatStream(
    @Body() dto: ChatDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.user as any;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    let eventId = 0;
    try {
      const stream = this.orchestrator.chatStream(dto.messages, dto.context, user?.userId);

      for await (const chunk of stream) {
        eventId++;
        const data = JSON.stringify(chunk);
        res.write(`id: ${eventId}\ndata: ${data}\n\n`);
      }
    } catch (err) {
      console.error('SSE Error in Vesper Chat', err);
      eventId++;
      const errorChunk = JSON.stringify({
        type: 'text',
        content: 'Our intelligence network experienced an interruption. Please try again.',
      });
      res.write(`id: ${eventId}\ndata: ${errorChunk}\n\n`);
    }

    res.end();
  }
}
