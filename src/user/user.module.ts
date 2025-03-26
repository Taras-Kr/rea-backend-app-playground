import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtCookieAuthGuard } from '../common/guards/jwtCookieAuth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../handbooks/user-type/entities/user-type.entity';
import { UserRole } from '../handbooks/user-role/entities/user-role.entity';
import { UserRoleService } from '../handbooks/user-role/user-role.service';
import { UserTypesService } from '../handbooks/user-type/user-types.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserType, UserRole])],
  providers: [
    UserService,
    JwtService,
    JwtCookieAuthGuard,
    UserTypesService,
    UserRoleService,
    ConfigService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
