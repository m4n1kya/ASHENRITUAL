import { ArchivesService } from './archives.service';
import { CreateArchiveDto } from './dto/create-archive.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class ArchivesController {
    private readonly archivesService;
    constructor(archivesService: ArchivesService);
    create(dto: CreateArchiveDto, req: {
        user: JwtUser;
    }): Promise<{
        items: ({
            product: {
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
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    findMyArchives(req: {
        user: JwtUser;
    }): Promise<({
        items: ({
            product: {
                id: string;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: string[];
            };
        } & {
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
    findOne(id: string, req: {
        user: JwtUser;
    }): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                images: string[];
            };
        } & {
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            archiveId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
}
export {};
