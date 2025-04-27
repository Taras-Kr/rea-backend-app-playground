import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacteristicValueDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Значення характеристики',
    example: 'Електричне',
    required: true,
  })
  value: string;
}
