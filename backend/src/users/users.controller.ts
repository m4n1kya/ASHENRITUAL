import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const userId = req.user?.id;
    return this.usersService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const userId = req.user?.id;
    return this.usersService.updateUserProfile(userId, updateData);
  }

  @Post('username/check')
  async checkUsername(@Body('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    const isAvailable = await this.usersService.isUsernameAvailable(username);
    return { available: isAvailable };
  }

  @UseGuards(JwtAuthGuard)
  @Put('username')
  async updateUsername(@Req() req: any, @Body('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    const userId = req.user?.id;
    return this.usersService.updateUsername(userId, username);
  }
}
