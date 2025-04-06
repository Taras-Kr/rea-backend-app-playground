import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrencyDto {
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty({
    description: 'Назва валюти',
    example: 'Гривня',
    maxLength: 20,
    uniqueItems: true,
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @MaxLength(3)
  @ApiProperty({
    description: 'Код валюти',
    example: 'UAH',
    maxLength: 3,
    uniqueItems: true,
    required: true,
  })
  code: string;

  @IsNotEmpty()
  @MaxLength(3)
  @ApiProperty({
    description: 'Символ валюти',
    example: '₴',
    maxLength: 3,
    uniqueItems: true,
    required: true,
  })
  symbol: string;
}
