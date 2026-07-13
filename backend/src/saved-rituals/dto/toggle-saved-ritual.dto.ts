import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleSavedRitualDto {
  @ApiProperty({ description: 'Product UUID to toggle in Saved Rituals', example: 'a1b2c3d4-...' })
  @IsUUID()
  productId: string;
}
