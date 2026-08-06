import { PrismaService } from '../prisma/prisma.service';
export declare class VesperService {
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
        })[];
    }>;
}
