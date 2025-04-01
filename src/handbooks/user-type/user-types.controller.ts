import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('handbooks/user-types')
export class UserTypesController {
  constructor(private readonly userTypeService: UserTypesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles('owner', 'admin')
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get('archive')
  @Roles('owner', 'admin', 'agent')
  findAllArchive() {
    return this.userTypeService.findDeletedAll();
  }

  @Get()
  @Roles('owner', 'admin', 'agent')
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get('by-role')
  @Roles('owner', 'admin', 'agent')
  findByRole(
    @Query('role') role?: string,
    @Query('role_title') role_title?: string,
  ) {
    return this.userTypeService.findByRole({ role, role_title });
  }

  @Get('by-type')
  @Roles('owner', 'admin', 'agent')
  findByType(
    @Query('type') type?: string,
    @Query('type_title') type_title?: string,
  ) {
    return this.userTypeService.findByType({ type, type_title });
  }

  @Get(':uuid')
  @Roles('owner', 'admin', 'agent')
  findOne(@Param('uuid') uuid: string) {
    return this.userTypeService.findOne(uuid);
  }

  @Put(':uuid')
  @Roles('owner', 'admin')
  @UsePipes(new ValidationPipe())
  update(
    @Param('uuid') uuid: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(uuid, updateUserTypeDto);
  }

  @Delete(':uuid')
  @Roles('owner', 'admin')
  remove(@Param('uuid') uuid: string) {
    return this.userTypeService.delete(uuid);
  }

  @Put('archive/:uuid')
  @Roles('owner', 'admin')
  restore(@Param('uuid') uuid: string) {
    return this.userTypeService.restore(uuid);
  }
}
