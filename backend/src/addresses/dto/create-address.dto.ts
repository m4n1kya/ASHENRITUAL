import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Street address', example: '12 Shadow Lane' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'City', example: 'London' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Postal / ZIP code', example: 'SW1A 1AA' })
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty({ description: 'Country', example: 'United Kingdom' })
  @IsString()
  @IsNotEmpty()
  country: string;
}
