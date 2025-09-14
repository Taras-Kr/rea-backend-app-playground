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
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Користувачі')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('archive')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findAllArchive() {
    return this.userService.findAllDeleted();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Delete(':uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  delete(@Param('uuid') uuid: string) {
    return this.userService.delete(uuid);
  }

  @Put('archive/:uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  restore(@Param('uuid') uuid: string) {
    return this.userService.restore(uuid);
  }

  @Put(':uuid')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }
}
