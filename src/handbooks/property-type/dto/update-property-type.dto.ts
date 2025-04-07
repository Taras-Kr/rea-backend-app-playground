import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertyTypeDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Назва типу нерухомості',
    example: 'Квартира',
    required: true,
  })
  name: string;

  @IsOptional()
  @MaxLength(1000)
  @ApiProperty({
    description: 'Опис типу нерухомості',
    example: 'Житлове приміщення в багатоквартирному будинку',
    required: false,
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "Посилання на категорію об'єкту нерухомості (UUID)",
    example: '6d2e885e-e309-4368-bac5-b26533565a67',
    required: true,
  })
  category_uuid: string;
}
