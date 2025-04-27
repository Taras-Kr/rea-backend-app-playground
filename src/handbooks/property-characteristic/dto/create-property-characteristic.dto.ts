import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { PropertyCharacteristicsType } from '../entities/property-characteristic.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyCharacteristicDto {
  @IsNotEmpty()
  @Length(3, 50)
  @ApiProperty({
    description: "Назва характеристики об'єкта нерухомості",
    example: 'Тип опалення',
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(PropertyCharacteristicsType)
  @ApiProperty({
    description: "Тип характеристики об'єкта нерухомості",
    example: '1',
    required: true,
  })
  type: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Ознака вибір декількох',
    example: 'false',
    required: true,
  })
  is_multiple: boolean;

  @IsOptional()
  @ApiProperty({
    description: "Опис характеристики об'єкта нерухомості",
    example: 'Пічне опалення',
    required: false,
  })
  description: string;
}
