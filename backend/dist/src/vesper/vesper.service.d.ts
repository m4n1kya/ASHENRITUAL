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
    }): unknown;
    generateOutfit(userId: string): unknown;
}
