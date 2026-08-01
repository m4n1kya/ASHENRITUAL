import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultVesperDto {
  @IsString()
  @IsNotEmpty()
  occasion: string;

  @IsString()
  @IsNotEmpty()
  weather: string;

  @IsString()
  @IsNotEmpty()
  dressCode: string;

  @IsString()
  @IsNotEmpty()
  palette: string;

  @IsString()
  @IsNotEmpty()
  silhouette: string;
}
