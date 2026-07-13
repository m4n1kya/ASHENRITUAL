import {
  IsArray,
  IsString,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/** A single line item in an order. */
export class ArchiveItemDto {
  @ApiProperty({ description: 'Product UUID', example: 'a1b2c3d4-...' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity to order', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

/** Request body for creating a new Archive (Order). */
export class CreateArchiveDto {
  @ApiProperty({ type: [ArchiveItemDto], description: 'Order line items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArchiveItemDto)
  items: ArchiveItemDto[];

  @ApiProperty({ description: 'Shipping address UUID', example: 'a1b2c3d4-...' })
  @IsString()
  @IsNotEmpty()
  addressId: string;
}
