import { Module } from '@nestjs/common';
import { OblivController } from './obliv.controller';
import { OblivService } from './obliv.service';

@Module({
  controllers: [OblivController],
  providers: [OblivService],
})
export class OblivModule {}
