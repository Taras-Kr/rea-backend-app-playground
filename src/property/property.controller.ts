import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';

import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetByUUID,
  SwaggerRestore,
  SwaggerUpdate,
} from '../common/decorators/swagger/common.decorator';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import * as examples from './swagger/responses.swagger';
import { CustomApiResponse } from '../common/dto/api-response.dto';
import { CreateFullPropertyDto } from './dto/create-full-property';
import { UpdateFullPropertyDto } from './dto/update-full-property.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags("Об'єкти нерухомості")
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення запису про новий об'єкт нерухомості",
    summary: "Створення запису про новий об'єкт нерухомості",
    example201: examples.create201,
    example400: examples.create400,
  })
  @ApiResponse({ status: 404, example: examples.create404 })
  // async create(@Body() createPropertyDto: CreatePropertyWithLocationDto) {
  //   const result = await this.propertyService.create(createPropertyDto);
  //   return new CustomApiResponse(result, 'Created', HttpStatus.CREATED);
  // }
  async create(@Body() createPropertyDto: CreateFullPropertyDto) {
    const result = await this.propertyService.createProperty(createPropertyDto);
    return new CustomApiResponse(result, 'Created', HttpStatus.CREATED);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get()
  @SwaggerGet({
    description: "Отримання всіх не видалених об'єктів нерухомості",
    summary: "Отримання всіх не видалених об'єктів нерухомості",
    example200: examples.get200,
  })
  findAll() {
    return this.propertyService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get('archive')
  @SwaggerGet({
    description: "Отримання записів після м'якого видалення",
    summary: "Отримання записів після м'якого видалення",
    example200: examples.get200,
  })
  findDeletedAll() {
    return this.propertyService.findDeletedAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get(':uuid')
  @SwaggerGetByUUID({
    description: "Отримання об'єкта нерухомості",
    summary: "Отримання об'єкта нерухомості",
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.propertyService.findOne(uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: "Редагування об'єкта нерухомості",
    summary: "Редагування об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID обєкта нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyDto: UpdateFullPropertyDto,
  ) {
    const result = await this.propertyService.updateProperty(
      uuid,
      updatePropertyDto,
    );
    return new CustomApiResponse(result, 'Updated', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Put('archive/:uuid')
  @SwaggerRestore()
  @ApiParam({
    name: 'uuid',
    description: 'UUID обєкта нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const result = await this.propertyService.restore(uuid);
    return new CustomApiResponse(result, 'Restored', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Delete(':uuid')
  @SwaggerDelete()
  @ApiParam({ name: 'uuid', example: '4deedf09-b86d-4799-ab10-ae1424471540' })
  async remove(@Param('uuid') uuid: string) {
    const response = await this.propertyService.softDelete(uuid);
    return new CustomApiResponse(response, 'Delete', HttpStatus.OK);
  }
}
