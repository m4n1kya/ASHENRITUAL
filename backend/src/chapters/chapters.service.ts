import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  /** Return all Chapters (Collections) ordered by creation date. */
  async findAll() {
    return this.prisma.chapter.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Return a single Chapter by its slug.
   * The Chapter model uses a `name` field. We derive the slug by replacing
   * spaces with hyphens and lowercasing — matching how seeds create them.
   * This query matches the slug stored directly on the record.
   */
  async findBySlug(slug: string) {
    // Chapters don't have a slug field in the schema, so we find by name
    // derived from slug (slug is the lowercased, hyphenated name).
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const chapter = await this.prisma.chapter.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with slug "${slug}" not found`);
    }

    return chapter;
  }
}
