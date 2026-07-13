import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultOblivDto {
  @ApiProperty({
    description: 'The wardrobe query to send to OBLIV',
    example: 'What should I wear to a gallery opening in winter?',
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}
