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
} from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

@Controller('handbooks/user-types')
export class UserTypesController {
  constructor(private readonly userTypeService: UserTypesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get('archive')
  findAllArchive() {
    return this.userTypeService.findDeletedAll();
  }

  @Get()
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get('by-role')
  findByRole(
    @Query('role') role?: string,
    @Query('role_title') role_title?: string,
  ) {
    return this.userTypeService.findByRole({ role, role_title });
  }

  @Get('by-type')
  findByType(
    @Query('type') type?: string,
    @Query('type_title') type_title?: string,
  ) {
    return this.userTypeService.findByType({ type, type_title });
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userTypeService.findOne(uuid);
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe())
  update(
    @Param('uuid') uuid: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(uuid, updateUserTypeDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userTypeService.delete(uuid);
  }

  @Put('archive/:uuid')
  restore(@Param('uuid') uuid: string) {
    return this.userTypeService.restore(uuid);
  }
}
