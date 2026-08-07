import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private resend: Resend | null = null;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (user.provider !== 'LOCAL' || !user.passwordHash) {
      throw new UnauthorizedException(
        `This email is associated with a ${user.provider} account. Please sign in with ${user.provider}.`,
      );
    }

    if (await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash: _, refreshToken: __, ...result } = user;
      return result;
    }
    return null;
  }

  async validateOAuthLogin(profile: any): Promise<any> {
    return this.usersService.upsertOAuthUser(profile);
  }

  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async login(user: any) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Hash refresh token before saving
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const verificationToken = randomBytes(32).toString('hex');

    const user = await this.usersService.create({
      email: createUserDto.email,
      passwordHash,
      verificationToken,
    });

    // Send verification email asynchronously if Resend is configured
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: 'ASHENRITUAL <no-reply@ashenritual.com>', // Update with your verified domain
          to: user.email,
          subject: 'Verify your email for ASHENRITUAL',
          html: `<p>Your verification token is: ${verificationToken}</p>`,
        });
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
    } else {
      console.warn(
        'RESEND_API_KEY not configured. Verification email skipped.',
      );
    }

    return this.login(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, salt);

    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
  }
}
