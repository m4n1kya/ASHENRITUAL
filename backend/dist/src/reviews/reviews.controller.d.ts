import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(dto: CreateReviewDto, req: {
        user: JwtUser;
    }): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    }>;
    findByProduct(productId: string): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    })[]>;
}
export {};
