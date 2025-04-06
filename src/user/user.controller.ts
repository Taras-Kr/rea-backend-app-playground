import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Користувачі')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('admin', 'owner', 'agent')
  @Get('archive')
  findAllArchive() {
    return this.userService.findAllDeleted();
  }

  // @UseGuards(JwtCookieAuthGuard)
  @Get()
  @Roles('admin', 'owner', 'agent')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @Roles('admin', 'owner', 'agent')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Roles('admin', 'owner')
  @Delete(':uuid')
  delete(@Param('uuid') uuid: string) {
    return this.userService.delete(uuid);
  }

  @Roles('admin', 'owner')
  @Put('archive/:uuid')
  restore(@Param('uuid') uuid: string) {
    return this.userService.restore(uuid);
  }

  @Roles('admin', 'owner')
  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }
}
