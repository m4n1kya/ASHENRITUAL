import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Obsidian Wool Coat' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'A structured coat in 100% merino wool.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Price in GBP', example: 349 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Category UUID', example: 'a1b2c3d4-...' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: 'Array of image URLs', example: ['https://cdn.ashen.com/coat.jpg'] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ description: 'Stock quantity', example: 25 })
  @IsInt()
  @Min(0)
  stock: number;
}
