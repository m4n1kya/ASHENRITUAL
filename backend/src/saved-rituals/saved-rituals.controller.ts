import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SavedRitualsService } from './saved-rituals.service';
import { ToggleSavedRitualDto } from './dto/toggle-saved-ritual.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('Saved Rituals (Wishlist)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('saved-rituals')
export class SavedRitualsController {
  constructor(private readonly savedRitualsService: SavedRitualsService) {}

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle a product in Saved Rituals (add if absent, remove if present)' })
  @ApiResponse({ status: 200, description: '{ action: "saved" | "removed", productId }' })
  toggle(
    @Body() dto: ToggleSavedRitualDto,
    @Request() req: { user: JwtUser },
  ) {
    return this.savedRitualsService.toggle(req.user.userId, dto.productId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Saved Rituals for the current user' })
  @ApiResponse({ status: 200, description: 'Returns the user\'s wishlist.' })
  findAll(@Request() req: { user: JwtUser }) {
    return this.savedRitualsService.findAll(req.user.userId);
  }
}
