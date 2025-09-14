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
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';

@Controller('handbooks/user-types')
export class UserTypesController {
  constructor(private readonly userTypeService: UserTypesService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get('archive')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findAllArchive() {
    return this.userTypeService.findDeletedAll();
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get('by-role')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findByRole(
    @Query('role') role?: string,
    @Query('role_title') role_title?: string,
  ) {
    return this.userTypeService.findByRole({ role, role_title });
  }

  @Get('by-type')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findByType(
    @Query('type') type?: string,
    @Query('type_title') type_title?: string,
  ) {
    return this.userTypeService.findByType({ type, type_title });
  }

  @Get(':uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findOne(@Param('uuid') uuid: string) {
    return this.userTypeService.findOne(uuid);
  }

  @Put(':uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @UsePipes(new ValidationPipe())
  update(
    @Param('uuid') uuid: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(uuid, updateUserTypeDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userTypeService.delete(uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Put('archive/:uuid')
  restore(@Param('uuid') uuid: string) {
    return this.userTypeService.restore(uuid);
  }
}
