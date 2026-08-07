import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string) {
    if (!query || query.trim() === '') {
      return { creators: [], showrooms: [], products: [], concepts: [], collections: [] };
    }

    const searchQuery = query.trim();

    // Perform parallel searches across all major entities
    const [creators, showrooms, products, concepts, collections] = await Promise.all([
      // Creators
      this.prisma.creator.findMany({
        where: {
          OR: [
            { user: { displayName: { contains: searchQuery, mode: 'insensitive' } } },
            { user: { username: { contains: searchQuery, mode: 'insensitive' } } },
            { specialization: { contains: searchQuery, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        include: { user: { select: { displayName: true, username: true, avatar: true } } },
        take: 5,
      }),

      // Showrooms
      this.prisma.showroom.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { city: { contains: searchQuery, mode: 'insensitive' } },
            { specialization: { contains: searchQuery, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        take: 5,
      }),

      // Products
      this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { tags: { has: searchQuery.toLowerCase() } },
          ],
          deletedAt: null,
        },
        include: { brand: true },
        take: 5,
      }),

      // Concepts
      this.prisma.concept.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { tags: { has: searchQuery.toLowerCase() } },
          ],
          visibility: 'PUBLIC',
          status: 'PUBLISHED',
          deletedAt: null,
        },
        include: { creator: { include: { user: { select: { displayName: true } } } } },
        take: 5,
      }),

      // Collections
      this.prisma.collection.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { theme: { contains: searchQuery, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        take: 5,
      }),
    ]);

    return {
      creators,
      showrooms,
      products,
      concepts,
      collections,
    };
  }
}
