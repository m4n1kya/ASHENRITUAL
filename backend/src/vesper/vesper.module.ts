import { Module } from '@nestjs/common';
import { VesperController } from './vesper.controller';
import { VesperOrchestrator } from './vesper.orchestrator';
import { GeminiProvider } from './providers/gemini.provider';
import { ContextManager } from './tools/context.manager';
import { RecommendationEngine } from './tools/recommendation.engine';
import { PrismaModule } from '../prisma/prisma.module';
import { VesperSizeService } from './vesper-size.service';

@Module({
  imports: [PrismaModule],
  controllers: [VesperController],
  providers: [
    VesperOrchestrator,
    GeminiProvider,
    ContextManager,
    RecommendationEngine,
    VesperSizeService,
  ],
  exports: [VesperOrchestrator],
})
export class VesperModule {}
