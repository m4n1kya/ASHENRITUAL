import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query?: string, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            brandId: string | null;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
            tags: string[];
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findFeatured(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        brandId: string | null;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
    })[]>;
    findNewArrivals(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        brandId: string | null;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
    })[]>;
    findBestSellers(): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        brandId: string | null;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
    })[]>;
    findByCategory(slug: string, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            brandId: string | null;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
            tags: string[];
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        reviews: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            comment: string | null;
            userId: string;
            productId: string;
            rating: number;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        brandId: string | null;
        description: string;
        price: import("@prisma/client/runtime/library").Decimal;
        images: string[];
        stock: number;
        categoryId: string;
        tags: string[];
    }>;
}
