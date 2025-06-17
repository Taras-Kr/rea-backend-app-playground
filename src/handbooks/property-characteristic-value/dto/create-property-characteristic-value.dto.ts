import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyCharacteristicValueDto {
  @IsNotEmpty({ message: "Не вказано об'єкт нерухомості" })
  @IsUUID(4, { message: "Некоректне UUID об'єкта нерухомості" })
  @ApiProperty({
    description: "Посилання на об'єкт нерухомості",
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: true,
  })
  property_uuid: string;

  @IsNotEmpty({ message: "Характеристика об'єкта обов'язкове поле" })
  @IsUUID(4, { message: "Некоректне UUID характеристики об'єкта нерухомості" })
  @ApiProperty({
    description: "Посилання на характеристику об'єкта нерухомості",
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: true,
  })
  property_characteristic_uuid: string;

  @IsNotEmpty({ message: "Значення характеристики обов'язкове поле" })
  @ApiProperty({
    description: "Значення характеристики об'єкта нерухомості",
    example: '1, "Є балкон", true, ["Автономне","Централізоване"]',
    required: true,
  })
  value: number | string | Array<string> | boolean;
}
