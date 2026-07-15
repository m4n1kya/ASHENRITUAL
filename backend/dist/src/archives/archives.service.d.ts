import { PrismaService } from '../prisma/prisma.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ArchivesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateArchiveDto): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: Decimal;
                images: string[];
                stock: number;
                categoryId: string;
            };
        } & {
            id: string;
            price: Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    findUserArchives(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                price: Decimal;
                images: string[];
            };
        } & {
            id: string;
            price: Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                price: Decimal;
                images: string[];
            };
        } & {
            id: string;
            price: Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
}
