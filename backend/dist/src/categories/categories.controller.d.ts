import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        slug: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findBySlug(slug: string): Promise<{
        products: ({
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
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
        })[];
    } & {
        slug: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
