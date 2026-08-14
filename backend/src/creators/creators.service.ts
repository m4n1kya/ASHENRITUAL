import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private prisma: PrismaService) {}

  async getCreatorByUserId(userId: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { userId },
    });
    if (!creator) throw new UnauthorizedException('User is not a Creator');
    return creator;
  }

  async getCreatorProfile(username: string) {
    // Strip the `@` if it was included in the URL parameter
    const cleanUsername = username.startsWith('@')
      ? username.substring(1)
      : username;

    const user = await this.prisma.user.findUnique({
      where: { username: cleanUsername },
      include: {
        creator: {
          include: {
            concepts: {
              where: { status: 'PUBLISHED', deletedAt: null },
              orderBy: { createdAt: 'desc' },
            },
            showrooms: true,
          },
        },
      },
    });

    if (!user || !user.creator) {
      throw new NotFoundException('Creator not found');
    }

    // Return a safe public profile
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      location: `${user.city || ''}, ${user.country || ''}`.replace(
        /^, | , $/g,
        '',
      ),
      creatorProfile: user.creator,
    };
  }

  async createConcept(userId: string, data: any) {
    const creator = await this.getCreatorByUserId(userId);

    return this.prisma.concept.create({
      data: {
        creatorId: creator.id,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        gallery: data.gallery || [],
        category: data.category,
        season: data.season,
        tags: data.tags || [],
        materials: data.materials || [],
        softwareUsed: data.softwareUsed || [],
        visibility: data.visibility || 'PUBLIC',
        status: data.status || 'PUBLISHED',
        collectionId: data.collectionId || null,
      },
    });
  }

  async getConcepts(userId: string, status?: any) {
    const creator = await this.getCreatorByUserId(userId);

    return this.prisma.concept.findMany({
      where: {
        creatorId: creator.id,
        ...(status && { status }),
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        collection: true,
      },
    });
  }

  async getCollections(userId: string) {
    const creator = await this.getCreatorByUserId(userId);
    return this.prisma.collection.findMany({
      where: { creatorId: creator.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { concepts: true } },
      },
    });
  }

  async getAnalytics(userId: string) {
    const creator = await this.getCreatorByUserId(userId);

    const concepts = await this.prisma.concept.findMany({
      where: { creatorId: creator.id, deletedAt: null },
      select: { views: true, likesCount: true, bookmarksCount: true },
    });

    const totalViews = concepts.reduce((acc, curr) => acc + curr.views, 0);
    const totalLikes = concepts.reduce((acc, curr) => acc + curr.likesCount, 0);
    const totalBookmarks = concepts.reduce(
      (acc, curr) => acc + curr.bookmarksCount,
      0,
    );

    const followersCount = await this.prisma.follow.count({
      where: { followingId: userId },
    });

    return {
      totalViews,
      totalLikes,
      totalBookmarks,
      followersCount,
      totalConcepts: concepts.length,
    };
  }

  async getConceptBySlug(slug: string) {
    // We don't actually have a slug field on Concept in the Prisma schema right now,
    // so we'll treat 'slug' as the 'id' for the time being to fix TS errors.
    const concept = await this.prisma.concept.findUnique({
      where: { id: slug },
      include: {
        creator: {
          include: {
            user: {
              select: { username: true, displayName: true, avatar: true },
            },
          },
        },
        collection: true,
      },
    });

    if (!concept || concept.deletedAt) {
      throw new NotFoundException('Concept not found');
    }

    return concept;
  }
}
