import { Controller, Get, Post, Body, Query, UseGuards, Req, Param } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('concepts')
  async createConcept(@Req() req: any, @Body() data: any) {
    const userId = req.user?.id;
    return this.creatorsService.createConcept(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('concepts')
  async getConcepts(@Req() req: any, @Query('status') status?: string) {
    const userId = req.user?.id;
    return this.creatorsService.getConcepts(userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('collections')
  async getCollections(@Req() req: any) {
    const userId = req.user?.id;
    return this.creatorsService.getCollections(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  async getAnalytics(@Req() req: any) {
    const userId = req.user?.id;
    return this.creatorsService.getAnalytics(userId);
  }

  @Get('concept/:slug')
  async getConceptBySlug(@Param('slug') slug: string) {
    return this.creatorsService.getConceptBySlug(slug);
  }

  @Get(':username')
  async getPublicProfile(@Param('username') username: string) {
    return this.creatorsService.getCreatorProfile(username);
  }
}
