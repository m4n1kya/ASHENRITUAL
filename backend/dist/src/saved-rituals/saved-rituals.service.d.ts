import { PrismaService } from '../prisma/prisma.service';
export declare class SavedRitualsService {
    private prisma;
    constructor(prisma: PrismaService);
    toggle(userId: string, productId: string): unknown;
    findAll(userId: string): unknown;
}
