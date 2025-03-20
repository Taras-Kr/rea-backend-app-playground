import { Module } from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { UserTypesController } from './user-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from './entities/user-type.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserType, UserRole])],
  controllers: [UserTypesController],
  providers: [UserTypesService],
})
export class UserTypeModule {}
