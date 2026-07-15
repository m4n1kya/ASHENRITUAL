import { PrismaService } from '../prisma/prisma.service';
export declare class OblivService {
    private prisma;
    private ai;
    private readonly systemPrompt;
    constructor(prisma: PrismaService);
    consult(userQuery: string): Promise<{
        response: string | undefined;
    }>;
    generateOutfit(userId: string): Promise<{
        response: string | undefined;
    }>;
}
