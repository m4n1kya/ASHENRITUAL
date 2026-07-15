import { PrismaService } from '../prisma/prisma.service';
export declare class SavedRitualsService {
    private prisma;
    constructor(prisma: PrismaService);
    toggle(userId: string, productId: string): Promise<{
        action: string;
        productId: string;
    }>;
    findAll(userId: string): Promise<({
        product: {
            category: {
                id: string;
                name: string;
                slug: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
}
