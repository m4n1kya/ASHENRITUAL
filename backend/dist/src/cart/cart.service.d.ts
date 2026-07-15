import { PrismaService } from '../prisma/prisma.service';
import { ValidateCartDto } from './dto/validate-cart.dto';
export interface ValidatedCartLine {
    productId: string;
    name: string;
    price: number;
    images: string[];
    requestedQuantity: number;
    availableStock: number;
    isAvailable: boolean;
}
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    validate(dto: ValidateCartDto): Promise<{
        isValid: boolean;
        items: ValidatedCartLine[];
        issues: string[];
    }>;
}
