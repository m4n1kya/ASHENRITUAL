import { Module } from '@nestjs/common';
import { SavedRitualsController } from './saved-rituals.controller';
import { SavedRitualsService } from './saved-rituals.service';

@Module({
  controllers: [SavedRitualsController],
  providers: [SavedRitualsService],
  exports: [SavedRitualsService],
})
export class SavedRitualsModule {}
