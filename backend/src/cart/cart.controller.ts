import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { ValidateCartDto } from './dto/validate-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('validate')
  @ApiOperation({
    summary: 'Validate cart items before checkout',
    description:
      'Takes an array of {productId, quantity} from the Zustand frontend store and returns live price/stock data, flagging any issues.',
  })
  @ApiResponse({ status: 200, description: 'Cart validation result with per-item details.' })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  validate(@Body() dto: ValidateCartDto, @Request() req: { user: { userId: string } }) {
    // req.user is available for future user-specific pricing or discounts
    return this.cartService.validate(dto);
  }
}
