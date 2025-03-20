import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';

@Controller('/handbooks/user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    const userRole = await this.userRoleService.create(createUserRoleDto);
    return new ApiResponse(userRole, 'Created', HttpStatus.CREATED);
  }

  @Get('archive')
  findDeletedAll() {
    return this.userRoleService.findDeletedAll();
  }

  @Get('by-type')
  findByType(
    @Query('type_uuid') typeUuid?: string,
    @Query('type') type_name?: string,
    @Query('type_title') type_title?: string,
  ) {
    console.log('typeUUID:', typeUuid);
    console.log('type:', type_name);

    return this.userRoleService.findByType({ typeUuid, type_name, type_title });
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userRoleService.findOne(uuid);
  }

  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.userRoleService.update(uuid, updateUserRoleDto);
    return new ApiResponse(uuid, 'Updated', HttpStatus.OK);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const resp = await this.userRoleService.softDelete(uuid);
    return new ApiResponse(resp, 'Deleted', HttpStatus.OK);
  }

  @Put('archive/:uuid')
  async restore(@Param('uuid') uuid: string) {
    const res = await this.userRoleService.restore(uuid);
    return new ApiResponse(res, 'Restored', HttpStatus.OK);
  }
}
