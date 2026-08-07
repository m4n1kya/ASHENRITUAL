import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('signature')
  getSignature(@Query('folder') folder: string) {
    return this.cloudinaryService.generateSignature(folder || 'misc');
  }
}
