import { SavedRitualsService } from './saved-rituals.service';
import { ToggleSavedRitualDto } from './dto/toggle-saved-ritual.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class SavedRitualsController {
    private readonly savedRitualsService;
    constructor(savedRitualsService: SavedRitualsService);
    toggle(dto: ToggleSavedRitualDto, req: {
        user: JwtUser;
    }): Promise<{
        action: string;
        productId: string;
    }>;
    findAll(req: {
        user: JwtUser;
    }): Promise<({
        product: {
            category: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
}
export {};
