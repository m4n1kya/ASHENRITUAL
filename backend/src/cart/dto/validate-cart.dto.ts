import { IsString, IsInt, Min, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/** Represents a single cart line item to validate. */
export class CartItemDto {
  @ApiProperty({ description: 'Product UUID', example: 'a1b2c3d4-...' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity requested', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

/** Request body for POST /cart/validate */
export class ValidateCartDto {
  @ApiProperty({ type: [CartItemDto], description: 'Array of cart line items to validate' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
