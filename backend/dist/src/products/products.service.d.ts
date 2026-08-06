import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: string, page?: number, limit?: number): unknown;
    findOne(id: string): unknown;
    findByCategory(slug: string, page?: number, limit?: number): unknown;
    findFeatured(): unknown;
    findNewArrivals(): unknown;
    findBestSellers(): unknown;
}
