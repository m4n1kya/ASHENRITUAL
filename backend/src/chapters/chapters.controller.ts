import { Controller, Get, Param } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Chapters (Collections)')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Chapters (Collections)' })
  @ApiResponse({ status: 200, description: 'Returns all chapters.' })
  findAll() {
    return this.chaptersService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a Chapter by slug (e.g. forged-today)' })
  @ApiParam({ name: 'slug', description: 'Chapter slug derived from name' })
  @ApiResponse({ status: 200, description: 'Returns the chapter.' })
  @ApiResponse({ status: 404, description: 'Chapter not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.chaptersService.findBySlug(slug);
  }
}
