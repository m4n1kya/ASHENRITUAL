import { PrismaService } from '../prisma/prisma.service';
export declare class ChaptersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        description: string | null;
        quote: string | null;
        quoteAuthor: string | null;
        image: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        products: ({
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string | null;
        description: string | null;
        quote: string | null;
        quoteAuthor: string | null;
        image: string | null;
    }>;
}
