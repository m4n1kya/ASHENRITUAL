import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        products: ({
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
        })[];
    } & {
        slug: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
}
