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
    }): unknown;
    findByProduct(productId: string): unknown;
}
export {};
