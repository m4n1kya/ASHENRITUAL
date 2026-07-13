import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /** Fetch all products, optionally filtered by a search query. */
  async findAll(query?: string) {
    if (query) {
      return this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Fetch a single product by ID, including category and reviews. */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: { include: { user: { select: { id: true, email: true } } } } },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Fetch all products belonging to a category by its slug.
   * Uses the Category relation via category.slug.
   */
  async findByCategory(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return this.prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns "featured" products — defined as the top 8 products by
   * the number of times they have been saved to SavedRituals.
   */
  async findFeatured() {
    // Aggregate saved rituals to find most-wished products
    const topSaved = await this.prisma.savedRitual.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 8,
    });

    const productIds = topSaved.map((s) => s.productId);

    if (productIds.length === 0) {
      // Fallback: return latest 8 products if no wishlist data yet
      return this.prisma.product.findMany({
        take: 8,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
  }

  /**
   * Returns the 8 most recently added products.
   */
  async findNewArrivals() {
    return this.prisma.product.findMany({
      take: 8,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns "best sellers" — the top 8 products by total units sold
   * across all order items.
   */
  async findBestSellers() {
    const topSold = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 8,
    });

    const productIds = topSold.map((o) => o.productId);

    if (productIds.length === 0) {
      // Fallback: return latest 8 products if no order data yet
      return this.prisma.product.findMany({
        take: 8,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
  }
}
