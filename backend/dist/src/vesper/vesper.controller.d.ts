import { VesperService } from './vesper.service';
import { ConsultVesperDto } from './dto/consult-vesper.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class VesperController {
    private readonly vesperService;
    constructor(vesperService: VesperService);
    consult(dto: ConsultVesperDto): Promise<{
        id: string;
        title: any;
        description: any;
        stylingNotes: any;
        products: ({
            category: {
                slug: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
    generateOutfit(req: {
        user: JwtUser;
    }): Promise<{
        id: string;
        title: any;
        description: any;
        stylingNotes: any;
        products: ({
            category: {
                slug: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
export {};
