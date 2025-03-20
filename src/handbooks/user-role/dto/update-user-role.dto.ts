import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @MaxLength(40)
  role: string;
  @IsNotEmpty()
  @MaxLength(40)
  title: string;
  @IsNotEmpty()
  @IsUUID()
  type_uuid: string;
}
