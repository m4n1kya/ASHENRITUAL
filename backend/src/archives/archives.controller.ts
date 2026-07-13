import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ArchivesService } from './archives.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

/** Shape of the JWT payload attached to req.user by the strategy. */
interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('Archives (Orders)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('archives')
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Archive (place an order)' })
  @ApiResponse({ status: 201, description: 'Archive created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid items or insufficient stock.' })
  create(
    @Body() dto: CreateArchiveDto,
    @Request() req: { user: JwtUser },
  ) {
    return this.archivesService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Archives (orders) for the current user' })
  @ApiResponse({ status: 200, description: 'Returns user\'s order history.' })
  findMyArchives(@Request() req: { user: JwtUser }) {
    return this.archivesService.findUserArchives(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Archive by ID (must belong to current user)' })
  @ApiParam({ name: 'id', description: 'Archive UUID' })
  @ApiResponse({ status: 200, description: 'Returns the archive detail.' })
  @ApiResponse({ status: 404, description: 'Archive not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(
    @Param('id') id: string,
    @Request() req: { user: JwtUser },
  ) {
    return this.archivesService.findOne(id, req.user.userId);
  }
}
