import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCharacteristicValueDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Значення характеристики',
    example: 'Електричне',
    required: true,
  })
  value: string;
}
