import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePropertyCategoryDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
