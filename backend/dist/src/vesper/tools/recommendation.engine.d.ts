import { PrismaService } from '../../prisma/prisma.service';
export declare class RecommendationEngine {
    private prisma;
    constructor(prisma: PrismaService);
    retrieveContextData(lastUserQuery: string): Promise<string>;
}
