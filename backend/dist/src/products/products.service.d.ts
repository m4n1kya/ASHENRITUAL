import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: string, page?: number, limit?: number): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
        } & {
            id: string;
            brandId: string | null;
            name: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
        reviews: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
            rating: number;
            comment: string | null;
        })[];
    } & {
        id: string;
        brandId: string | null;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findByCategory(slug: string, page?: number, limit?: number): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
        } & {
            id: string;
            brandId: string | null;
            name: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findFeatured(): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
    } & {
        id: string;
        brandId: string | null;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findNewArrivals(): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
    } & {
        id: string;
        brandId: string | null;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    findBestSellers(): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        };
    } & {
        id: string;
        brandId: string | null;
        name: string;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
}
