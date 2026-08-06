import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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
    createProduct(dto: CreateProductDto): unknown;
    updateProduct(id: string, dto: UpdateProductDto): unknown;
    deleteProduct(id: string): unknown;
    getOrders(): unknown;
}
