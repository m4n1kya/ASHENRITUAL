import { CartService } from './cart.service';
import { ValidateCartDto } from './dto/validate-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    validate(dto: ValidateCartDto, req: {
        user: {
            userId: string;
        };
    }): Promise<{
        isValid: boolean;
        items: import("./cart.service").ValidatedCartLine[];
        issues: string[];
    }>;
}
