import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Submit a product review (authenticated, one per product)' })
  @ApiResponse({ status: 201, description: 'Review created.' })
  @ApiResponse({ status: 409, description: 'Already reviewed this product.' })
  create(
    @Body() dto: CreateReviewDto,
    @Request() req: { user: JwtUser },
  ) {
    return this.reviewsService.create(req.user.userId, dto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a product (public)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Returns reviews for the product.' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }
}
