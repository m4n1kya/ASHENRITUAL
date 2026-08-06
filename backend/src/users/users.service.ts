import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      if (existingUser.provider !== 'LOCAL') {
        throw new ConflictException(`User registered via ${existingUser.provider}. Please sign in with ${existingUser.provider}.`);
      }
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async upsertOAuthUser(profile: any) {
    const existingUser = await this.findByEmail(profile.email);

    if (existingUser) {
      // Merge account
      const user = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          provider: 'GOOGLE',
          providerId: profile.providerId,
          name: existingUser.name || profile.name,
          avatar: existingUser.avatar || profile.picture,
          emailVerified: true,
        },
      });
      const { passwordHash: _, ...result } = user;
      return result;
    }

    // Create new
    const user = await this.prisma.user.create({
      data: {
        email: profile.email,
        provider: 'GOOGLE',
        providerId: profile.providerId,
        name: profile.name,
        avatar: profile.picture,
        emailVerified: true,
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
