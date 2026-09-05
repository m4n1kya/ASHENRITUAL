/**
 * @fileoverview ASHENRITUAL Architecture
 * @module chapters.service.ts
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.chapter.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  /**
   * Return a single Chapter by its slug.
   * The Chapter model uses a `name` field. We derive the slug by replacing
   * spaces with hyphens and lowercasing — matching how seeds create them.
   * This query matches the slug stored directly on the record.
   */
  async findBySlug(slug: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with slug "${slug}" not found`);
    }

    return chapter;
  }
}
