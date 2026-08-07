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
        name: string;
        createdAt: Date;
        updatedAt: Date;
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
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
            showroomId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string | null;
        description: string | null;
        quote: string | null;
        quoteAuthor: string | null;
        image: string | null;
    }>;
}
