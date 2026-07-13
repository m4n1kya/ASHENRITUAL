import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a review for a product.
   * Enforces one review per user per product via ConflictException.
   */
  async create(userId: string, dto: CreateReviewDto) {
    // Validate product exists
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException(`Product ${dto.productId} not found.`);
    }

    // Enforce one review per user per product
    const existing = await this.prisma.review.findFirst({
      where: { userId, productId: dto.productId },
    });
    if (existing) {
      throw new ConflictException('You have already reviewed this product.');
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });
  }

  /** Returns all reviews for a product, newest first. */
  async findByProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found.`);
    }

    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
