import { OblivService } from './obliv.service';
import { ConsultOblivDto } from './dto/consult-obliv.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class OblivController {
    private readonly oblivService;
    constructor(oblivService: OblivService);
    consult(dto: ConsultOblivDto): Promise<{
        id: string;
        title: any;
        description: any;
        stylingNotes: any;
        products: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
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
