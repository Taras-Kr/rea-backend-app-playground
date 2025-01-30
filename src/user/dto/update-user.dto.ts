import { IsEmail, IsIn, IsOptional, Length, MaxLength } from 'class-validator';
import { UserRole } from '../enum/user-role';

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

  @IsOptional()
  @IsIn(['user', 'agent'])
  type: 'user' | 'agent';

  @IsOptional()
  @IsIn(['owner', 'admin', 'agent', 'user'])
  roles: UserRole;
}
