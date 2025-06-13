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
  UseGuards,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CustomApiResponse } from '../../common/dto/api-response.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('/handbooks/user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  @Roles('owner', 'admin')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    const userRole = await this.userRoleService.create(createUserRoleDto);
    return new CustomApiResponse(userRole, 'Created', HttpStatus.CREATED);
  }

  @Roles('owner', 'admin', 'agent')
  @Get('archive')
  findDeletedAll() {
    return this.userRoleService.findDeletedAll();
  }

  @Roles('owner', 'admin', 'agent')
  @Get('by-type')
  findByType(
    @Query('type_uuid') typeUuid?: string,
    @Query('type') type_name?: string,
    @Query('type_title') type_title?: string,
  ) {
    return this.userRoleService.findByType({ typeUuid, type_name, type_title });
  }

  @Roles('owner', 'admin', 'agent')
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userRoleService.findOne(uuid);
  }

  @Roles('owner', 'admin', 'agent')
  @Get()
  findAll() {
    return this.userRoleService.findAll();
  }

  @Roles('owner', 'admin')
  @Put(':uuid')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.userRoleService.update(uuid, updateUserRoleDto);
    return new CustomApiResponse(uuid, 'Updated', HttpStatus.OK);
  }

  @Roles('owner', 'admin')
  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const resp = await this.userRoleService.softDelete(uuid);
    return new CustomApiResponse(resp, 'Deleted', HttpStatus.OK);
  }

  @Roles('owner', 'admin')
  @Put('archive/:uuid')
  async restore(@Param('uuid') uuid: string) {
    const res = await this.userRoleService.restore(uuid);
    return new CustomApiResponse(res, 'Restored', HttpStatus.OK);
  }
}
