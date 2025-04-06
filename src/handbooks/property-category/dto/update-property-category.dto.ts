import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertyCategoryDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: "Назва категорії об'єкта нерухомості",
    example: 'Житлова нерухомість',
    maxLength: 100,
    uniqueItems: true,
    required: true,
  })
  name: string;
}
