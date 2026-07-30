import { PrismaService } from '../prisma/prisma.service';
export declare class OblivService {
    private prisma;
    private ai;
    private readonly systemPrompt;
    constructor(prisma: PrismaService);
    consult(params: {
        occasion: string;
        weather: string;
        dressCode: string;
        palette: string;
        silhouette: string;
    }): Promise<{
        id: string;
        title: any;
        description: any;
        stylingNotes: any;
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
            name: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
        })[];
    }>;
    generateOutfit(userId: string): Promise<{
        id: string;
        title: any;
        description: any;
        stylingNotes: any;
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
            name: string;
            description: string;
            price: import("@prisma/client/runtime/library").Decimal;
            images: string[];
            stock: number;
            categoryId: string;
        })[];
    }>;
}
