import { Module } from '@nestjs/common';
import { VesperController } from './vesper.controller';
import { VesperService } from './vesper.service';

@Module({
  controllers: [VesperController],
  providers: [VesperService],
})
export class VesperModule {}
