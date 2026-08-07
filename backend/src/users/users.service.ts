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
        throw new ConflictException(
          `User registered via ${existingUser.provider}. Please sign in with ${existingUser.provider}.`,
        );
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
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          displayName: existingUser.displayName || profile.name,
          avatar: existingUser.avatar || profile.picture,
        },
      });
      return updatedUser;
    } else {
      // Create new user
      const newUser = await this.prisma.user.create({
        data: {
          email: profile.email,
          provider: 'GOOGLE',
          providerId: profile.providerId,
          displayName: profile.name,
          avatar: profile.picture,
          emailVerified: true,
        },
      });

      const { passwordHash: _, ...result } = newUser;
      return result;
    }
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

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        creator: true,
        ownedBrands: true,
        ownedShowrooms: true,
        _count: {
          select: {
            followers: true,
            following: true,
            bookmarks: true,
          }
        }
      }
    });

    if (!user) throw new ConflictException('User not found');
    const { passwordHash: _, refreshToken: __, ...safeUser } = user;
    return safeUser;
  }

  async updateUserProfile(id: string, updateData: any) {
    // Restrict what can be updated via this endpoint
    const { displayName, bio, country, state, city, avatar, banner } = updateData;
    
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(displayName && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(country !== undefined && { country }),
        ...(state !== undefined && { state }),
        ...(city !== undefined && { city }),
        ...(avatar && { avatar }),
        ...(banner && { banner }),
      },
    });
    
    const { passwordHash: _, refreshToken: __, ...safeUser } = user;
    return safeUser;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const reservedWords = ['admin', 'support', 'vesper', 'forge', 'showrooms', 'sanctum', 'api', 'help'];
    if (reservedWords.includes(username.toLowerCase())) {
      return false; // Reserved
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    
    return !existingUser;
  }

  async updateUsername(id: string, username: string) {
    // 1. Validation
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      throw new ConflictException('Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores.');
    }

    // 2. Availability
    const isAvailable = await this.isUsernameAvailable(username);
    if (!isAvailable) {
      throw new ConflictException('Username is not available.');
    }

    // 3. Cooldown check
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new ConflictException('User not found');
    if (user.lastUsernameChange) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (user.lastUsernameChange > thirtyDaysAgo) {
        throw new ConflictException('You can only change your username once every 30 days.');
      }
    }

    // 4. Update
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        username,
        lastUsernameChange: new Date(),
      },
    });

    const { passwordHash: _, refreshToken: __, ...safeUser } = updatedUser;
    return safeUser;
  }
}
