import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ArchivesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Archive (Order) within a Prisma transaction:
   * 1. Validates all products exist and have sufficient stock
   * 2. Calculates the order total
   * 3. Creates Archive + OrderItems atomically
   * 4. Decrements product stock
   */
  async create(userId: string, dto: CreateArchiveDto) {
    const productIds = dto.items.map((i) => i.productId);

    // Fetch all products in one query
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock availability
    for (const item of dto.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Product ${item.productId} does not exist.`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        );
      }
    }

    // Calculate total
    const total = dto.items.reduce((sum, item) => {
      const price = Number(productMap.get(item.productId)!.price);
      return sum + price * item.quantity;
    }, 0);

    // Execute in a transaction for atomicity
    const archive = await this.prisma.$transaction(async (tx) => {
      // Create the archive record
      const newArchive = await tx.archive.create({
        data: {
          userId,
          total: new Decimal(total),
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Decrement stock for each item
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newArchive;
    });

    return archive;
  }

  /** Returns all archives (orders) belonging to the given user. */
  async findUserArchives(userId: string) {
    return this.prisma.archive.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Returns a single archive by ID, scoped to the requesting user. */
  async findOne(id: string, userId: string) {
    const archive = await this.prisma.archive.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, price: true } },
          },
        },
      },
    });

    if (!archive) {
      throw new NotFoundException(`Archive ${id} not found.`);
    }

    if (archive.userId !== userId) {
      throw new ForbiddenException('You do not have access to this archive.');
    }

    return archive;
  }
}
