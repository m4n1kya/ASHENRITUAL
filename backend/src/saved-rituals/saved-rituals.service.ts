import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedRitualsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Toggles a product in the user's Saved Rituals (wishlist).
   * If the item already exists → removes it (un-save).
   * If it doesn't exist → adds it (save).
   * Returns { action: 'saved' | 'removed', productId }.
   */
  async toggle(userId: string, productId: string) {
    // Verify the product exists
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found.`);
    }

    const existing = await this.prisma.savedRitual.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      await this.prisma.savedRitual.delete({ where: { id: existing.id } });
      return { action: 'removed', productId };
    }

    await this.prisma.savedRitual.create({
      data: { userId, productId },
    });

    return { action: 'saved', productId };
  }

  /** Returns all Saved Rituals for the given user, including product details. */
  async findAll(userId: string) {
    return this.prisma.savedRitual.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
