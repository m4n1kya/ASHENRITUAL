import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ShowroomsService } from './showrooms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('showrooms')
export class ShowroomsController {
  constructor(private readonly showroomsService: ShowroomsService) {}

  @Get()
  async getAllShowrooms() {
    return this.showroomsService.getAllShowrooms();
  }

  @Get(':slug')
  async getShowroom(@Param('slug') slug: string) {
    return this.showroomsService.getShowroomBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async applyToShowroom(@Req() req: any, @Param('id') showroomId: string, @Body() data: any) {
    const userId = req.user?.id;
    return this.showroomsService.applyToShowroom(userId, showroomId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('owner/analytics')
  async getAnalytics(@Req() req: any) {
    const userId = req.user?.id;
    return this.showroomsService.getDashboardAnalytics(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('applications/:appId')
  async updateApplication(
    @Req() req: any,
    @Param('appId') appId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED' | 'INTERVIEW'
  ) {
    const userId = req.user?.id;
    return this.showroomsService.updateApplication(userId, appId, status);
  }
}
