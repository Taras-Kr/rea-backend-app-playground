import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class UpdatePropertyDto {
  @IsNotEmpty({ message: 'Заголовок не може бути порожнім.' })
  @MaxLength(150, { message: 'Заголовок не може перевищувати 150 символів.' })
  @ApiProperty({
    description: "Заголовок (назва) об'єкту нерухомості",
    example: 'Затишна двокімнатна квартира на Липинського, 10 з видом на парк',
    required: true,
  })
  title: string;

  @IsNotEmpty({ message: 'Тип нерухомості не може бути порожнім.' })
  @IsUUID('4', { message: 'Некоректний формат UUID для типу нерухомості.' })
  @ApiProperty({
    description: 'Посилання на тип нерухомості',
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: true,
  })
  property_type_uuid: string;

  // @IsNotEmpty({ message: "Адреса об'єкта нерухомості не може бути порожньою." })
  // @IsUUID('4', {
  //   message: "Некоректний формат UUID для адреси об'єкта нерухомості.",
  // })
  // @ApiProperty({
  //   description: "Посилання на адресу об'єкта нерухомості",
  //   example: '6d2e885e-e309-4368-bac5-b26533565a67',
  //   required: true,
  // })
  // location_uuid: string;
  @IsOptional()
  @ApiProperty({
    description: "Ознака дозволу на використання об'єкта нерухомості",
    example: 'true',
    required: false,
  })
  is_published?: boolean;

  @IsOptional()
  @IsUUID('4', { message: 'Некоректний формат UUID для галереї.' })
  @ApiProperty({
    description: "Посилання галерею зображень об'єкта нерухомості",
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: false,
  })
  gallery_uuid?: string;
}
