import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdatePropertyCategoryDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
