import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(createUserDto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      createUserDto.email,
      createUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await this.authService.login(user);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user: userData };
  }

  @HttpCode(HttpStatus.OK)
  @Post('guest')
  @ApiOperation({ summary: 'Login as a demo guest user' })
  @ApiResponse({ status: 200, description: 'Guest user logged in' })
  async guestLogin(@Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.guestLogin();
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {
    // Passport redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const { accessToken, refreshToken, user } = await this.authService.login(
        req.user,
      );
      this.setRefreshTokenCookie(res, refreshToken);

      // Redirect back to frontend with the access token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const userParam = encodeURIComponent(JSON.stringify(user));
      res.redirect(
        `${frontendUrl}/auth/callback?token=${accessToken}&user=${userParam}`,
      );
    } catch (error: any) {
      console.error('GOOGLE OAUTH ERROR:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    // We need the userId to refresh, which we can extract from the token payload without verification
    // But it's better to verify the JWT signature first or let AuthService handle it
    // Wait, the jwt payload has sub = userId. We can decode it.
    const base64Url = refreshToken.split('.')[1];
    if (!base64Url) throw new UnauthorizedException('Invalid token format');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    const payload = JSON.parse(jsonPayload);
    const userId = payload.sub;

    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      try {
        const base64Url = refreshToken.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
          if (payload.sub) {
            await this.authService.logout(payload.sub);
          }
        }
      } catch (e) {
        // Ignore decode errors on logout
      }
    }
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
