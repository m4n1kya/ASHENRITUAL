import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /** Fetch all products, optionally filtered by a search query, with pagination. */
  async findAll(query?: string, page: number = 1, limit: number = 24) {
    const skip = (page - 1) * limit;
    
    const whereCondition = query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
      ],
    } : {};

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereCondition,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where: whereCondition })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
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
   * Fetch all products belonging to a category by its slug with pagination.
   */
  async findByCategory(slug: string, page: number = 1, limit: number = 24) {
    const category = await this.prisma.category.findUnique({ where: { slug } });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoryId: category.id },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where: { categoryId: category.id } })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
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
