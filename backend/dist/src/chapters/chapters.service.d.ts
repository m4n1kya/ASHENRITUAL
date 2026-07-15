import { PrismaService } from '../prisma/prisma.service';
export declare class ChaptersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        image: string | null;
    }>;
}
