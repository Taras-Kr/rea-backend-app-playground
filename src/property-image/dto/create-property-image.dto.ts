import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyImageDto {
  // @IsNotEmpty({ message: "Обов'язкове поле" })
  // @IsUUID('4', { message: "Не коректний формат UUID для об'єкта нерухомості" })
  // @ApiProperty({
  //   description: "Посилання на об'єкт нерухомості",
  //   example: '6d2e885e-e309-4368-bac5-b26533565a67',
  //   required: true,
  // })
  // property: string;

  @IsNotEmpty({ message: "Обов'язкове поле" })
  @ApiProperty({
    description: "Ім'я файлу зображення",
    example: '1756319649706-app_1.webp',
    required: true,
  })
  file_name: string;

  @IsNotEmpty({ message: "Обов'язкове поле" })
  @ApiProperty({
    description: 'URL файлу',
    example: 'http://1756319649706-app_1.webp',
    required: true,
  })
  url: string;

  @IsOptional()
  @ApiProperty({
    description: 'Ознака чи зображення є головне в галереї',
    example: 'false',
    required: false,
  })
  is_primary: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'Порядок сортування',
    example: '1',
    required: false,
  })
  position: number;

  @IsOptional()
  @ApiProperty({
    description: 'Опис зображення',
    example: 'Фото вітальні',
    required: false,
  })
  description: string;
}
