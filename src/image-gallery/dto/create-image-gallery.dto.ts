import { IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageGalleryDto {
  @IsNotEmpty({ message: "Обов'язкове поле" })
  @IsUUID(4, { message: "Некоректний UUID об'єкта нерухомості" })
  @ApiProperty({
    description: "UUID об'єкта нерухомості",
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: true,
  })
  property_uuid: string;

  @IsOptional()
  @Length(0, 255, { message: 'Не більше 255 символів' })
  @ApiProperty({
    description: 'Опис галереї',
    example: 'Двокімнатка квартира в новому ЖК',
    required: false,
  })
  description: string;
}
