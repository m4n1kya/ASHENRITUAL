import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OblivService } from './obliv.service';
import { ConsultOblivDto } from './dto/consult-obliv.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('OBLIV - Wardrobe Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('obliv')
export class OblivController {
  constructor(private readonly oblivService: OblivService) {}

  @Post('consult')
  @ApiOperation({ summary: 'Consult OBLIV for wardrobe intelligence' })
  @ApiResponse({ status: 200, description: 'OBLIV has analyzed the request.' })
  consult(@Body() dto: ConsultOblivDto) {
    return this.oblivService.consult(dto.query);
  }

  @Post('outfit')
  @ApiOperation({
    summary: 'Generate a personalized "Complete the Ritual" outfit',
    description:
      'OBLIV analyzes the user\'s Saved Rituals and past Archives to recommend a curated outfit.',
  })
  @ApiResponse({ status: 200, description: 'Returns a personalized outfit recommendation.' })
  generateOutfit(@Request() req: { user: JwtUser }) {
    return this.oblivService.generateOutfit(req.user.userId);
  }
}
