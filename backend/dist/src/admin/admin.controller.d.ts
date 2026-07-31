import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<import("./admin.service").DashboardStats>;
    createProduct(dto: CreateProductDto): Promise<{
        category: {
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<{
        category: {
            slug: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
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
        total: import("@prisma/client/runtime/library").Decimal;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
}
