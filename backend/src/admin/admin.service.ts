import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Decimal } from '@prisma/client/runtime/library';

/** Dashboard statistics returned by GET /admin/stats */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Aggregates key platform metrics for the admin dashboard.
   * Runs four queries in parallel for efficiency.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [revenueResult, totalOrders, totalUsers, totalProducts] = await Promise.all([
      this.prisma.archive.aggregate({ _sum: { total: true } }),
      this.prisma.archive.count(),
      this.prisma.user.count(),
      this.prisma.product.count(),
    ]);

    return {
      totalRevenue: Number(revenueResult._sum.total ?? 0),
      totalOrders,
      totalUsers,
      totalProducts,
    };
  }

  /** Creates a new product (admin only). */
  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: new Decimal(dto.price),
        categoryId: dto.categoryId,
        images: dto.images,
        stock: dto.stock,
      },
      include: { category: true },
    });
  }

  /** Partially updates a product (admin only). */
  async updateProduct(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price !== undefined && { price: new Decimal(dto.price) }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.images && { images: dto.images }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
      },
      include: { category: true },
    });
  }

  /** Deletes a product by ID (admin only). */
  async deleteProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: `Product ${id} deleted.` };
  }
}
