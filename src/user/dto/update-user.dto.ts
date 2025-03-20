import { IsEmail, IsIn, IsOptional, Length, MaxLength } from 'class-validator';
import { UserRoles } from '../enum/user-roles';

export class UpdateUserDto {
  // @IsOptional()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @Length(1, 50)
  surname: string;

  @IsOptional()
  @IsEmail()
  email: string;

  type_uuid: 'user' | 'agent';

  role_uuid: UserRoles;
}
