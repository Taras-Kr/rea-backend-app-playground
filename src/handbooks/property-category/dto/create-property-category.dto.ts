import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyCategoryDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: "Назва категорії об'єкта нерухомості",
    example: 'Житлова нерухомість',
  })
  name: string;
}
