import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VesperService } from './vesper.service';
import { ConsultVesperDto } from './dto/consult-vesper.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('VESPER - Wardrobe Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vesper')
export class VesperController {
  constructor(private readonly vesperService: VesperService) {}

  @Post('consult')
  @ApiOperation({ summary: 'Consult Vesper for wardrobe intelligence' })
  @ApiResponse({ status: 200, description: 'VESPER has curated an outfit.' })
  consult(@Body() dto: ConsultVesperDto) {
    return this.vesperService.consult(dto);
  }

  @Post('outfit')
  @ApiOperation({
    summary: 'Generate a personalized "Complete the Ritual" outfit',
    description:
      'VESPER analyzes the user\'s Saved Rituals and past Archives to recommend a curated outfit.',
  })
  @ApiResponse({ status: 200, description: 'Returns a personalized outfit recommendation.' })
  generateOutfit(@Request() req: { user: JwtUser }) {
    return this.vesperService.generateOutfit(req.user.userId);
  }
}
