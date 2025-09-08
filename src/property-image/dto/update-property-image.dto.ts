import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertyImageDto {
  @IsOptional()
  @ApiProperty({
    description: 'Ознака головного зображення',
    example: 'true',
    required: false,
  })
  is_primary: boolean;

  @IsOptional()
  @ApiProperty({
    description: 'Яким по черзі буде відображатись зображення',
    example: '1',
    required: false,
  })
  position: number;

  @IsOptional()
  @ApiProperty({
    description: 'Короткий опис зображення',
    example: 'Вітальня - фото 1',
    required: false,
  })
  description: string;
}
