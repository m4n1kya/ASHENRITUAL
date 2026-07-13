import { IsUUID, IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Product UUID to review', example: 'a1b2c3d4-...' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Rating from 1 to 5', example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Optional review comment', example: 'Exceptional quality.' })
  @IsOptional()
  @IsString()
  comment?: string;
}
