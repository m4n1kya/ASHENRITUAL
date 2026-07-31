import { ChaptersService } from './chapters.service';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        slug: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        quote: string | null;
        quoteAuthor: string | null;
        image: string | null;
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
        slug: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        quote: string | null;
        quoteAuthor: string | null;
        image: string | null;
    }>;
}
