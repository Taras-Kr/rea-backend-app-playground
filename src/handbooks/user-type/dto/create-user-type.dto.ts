import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserTypeDto {
  @IsNotEmpty()
  @MaxLength(40)
  type: string;
  @IsNotEmpty()
  @MaxLength(40)
  title: string;
}
