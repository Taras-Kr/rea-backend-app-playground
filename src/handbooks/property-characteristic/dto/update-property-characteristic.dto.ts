import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdatePropertyCharacteristicDto {
  @IsNotEmpty()
  @Length(3, 50)
  @ApiProperty({
    description: "Назва характеристики об'єкта нерухомості",
    example: 'Тип опалення',
    required: true,
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'Ознака вибір декількох',
    example: 'false',
    required: false,
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
