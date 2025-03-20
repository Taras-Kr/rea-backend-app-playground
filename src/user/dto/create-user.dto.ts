import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Ім'я користувача",
  })
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  @Length(0, 50)
  surname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 50)
  @IsDefined()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  confirm_password: string;

  @ApiProperty({
    required: false,
  })
  type_uuid: string;
  @ApiProperty({
    required: false,
  })
  role_uuid: string;
}
