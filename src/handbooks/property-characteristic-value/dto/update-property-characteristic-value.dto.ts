import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertyCharacteristicValueDto {
  @IsNotEmpty({
    message: "Значення характеристики об'єкта нерухомості неможе бути порожнім",
  })
  @ApiProperty({
    description: "Значення характеристики об'єкта нерухомості",
    example: '1 || "Є балкон" || true || ["Автономне","Централізоване"]',
    required: true,
  })
  value: number | string | Array<string> | boolean;
}
