import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateCartDto } from './dto/validate-cart.dto';

/** Shape of a validated cart line returned to the frontend. */
export interface ValidatedCartLine {
  productId: string;
  name: string;
  price: number;
  images: string[];
  requestedQuantity: number;
  availableStock: number;
  isAvailable: boolean;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validates an array of cart items against live DB data.
   * Returns each item enriched with current price, stock, and availability.
   * The frontend (Zustand) uses this to reconcile stale local state before checkout.
   */
  async validate(dto: ValidateCartDto): Promise<{
    isValid: boolean;
    items: ValidatedCartLine[];
    issues: string[];
  }> {
    const productIds = dto.items.map((i) => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const issues: string[] = [];
    const validatedItems: ValidatedCartLine[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        issues.push(`Product ${item.productId} no longer exists.`);
        validatedItems.push({
          productId: item.productId,
          name: 'Unknown Product',
          price: 0,
          images: [],
          requestedQuantity: item.quantity,
          availableStock: 0,
          isAvailable: false,
        });
        continue;
      }

      const isAvailable = product.stock >= item.quantity;

      if (!isAvailable) {
        issues.push(
          `"${product.name}" only has ${product.stock} unit(s) in stock (requested ${item.quantity}).`,
        );
      }

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        images: product.images,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
        isAvailable,
      });
    }

    return {
      isValid: issues.length === 0,
      items: validatedItems,
      issues,
    };
  }
}
