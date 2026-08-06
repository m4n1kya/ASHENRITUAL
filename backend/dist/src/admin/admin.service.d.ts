import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Decimal } from '@prisma/client/runtime/library';
export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
}
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<DashboardStats>;
    createProduct(dto: CreateProductDto): Promise<{
        category: {
            slug: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Decimal;
        images: string[];
        stock: number;
        categoryId: string;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<{
        category: {
            slug: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Decimal;
        images: string[];
        stock: number;
        categoryId: string;
    }>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    getOrders(): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: Decimal;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
}
