import {
  IsDecimal,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsOptional()
  @Length(0, 100)
  @ApiProperty({
    description: 'ОТГ (Об’єднана територіальна громада)',
    example: 'Львівська ОТГ',
    required: false,
  })
  community?: string;

  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    description: 'Населений пункт (місто, селище, селище міського типу)',
    example: 'місто Львів',
    required: true,
  })
  settlement: string;

  @IsOptional()
  @Length(0, 100)
  @ApiProperty({
    description: 'Район (для міст або селищ)',
    example: 'Франківський',
    required: false,
  })
  district?: string;

  @IsOptional()
  @Length(0, 100)
  @ApiProperty({
    description: 'Вулиця',
    example: 'Бойчука',
    required: false,
  })
  street?: string;

  @IsOptional()
  @Length(0, 6)
  @ApiProperty({
    description: 'Номер будинку',
    example: '100-Б',
    required: false,
  })
  building_number?: string;

  @IsOptional()
  @Length(0, 6)
  @ApiProperty({
    description: 'Номер квартири',
    example: '259-П',
    required: false,
  })
  apartment_number?: string;

  @IsOptional()
  @Length(0, 500)
  @ApiProperty({
    description: 'Опис локації',
    example: 'Вхід через провулок. Поряд школа',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsLatitude()
  @ApiProperty({
    description: 'Широта',
    example: '49.823321',
    required: false,
  })
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  @ApiProperty({
    description: 'Довгота',
    example: '24.0636658',
    required: false,
  })
  longitude?: number;
}
