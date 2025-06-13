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
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
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

@ApiTags("Об'єкти нерухомості")
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення запису про новий об'єкт нерухомості",
    summary: "Створення запису про новий об'єкт нерухомості",
    example201: examples.create201,
    example400: examples.create400,
  })
  @ApiResponse({ status: 404, example: examples.create404 })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    const result = await this.propertyService.create(createPropertyDto);
    return new CustomApiResponse(result, 'Created', HttpStatus.CREATED);
  }

  @Get()
  @SwaggerGet({
    description: "Отримання всіх не видалених об'єктів нерухомості",
    summary: "Отримання всіх не видалених об'єктів нерухомості",
    example200: examples.get200,
  })
  findAll() {
    return this.propertyService.findAll();
  }

  @Get('archive')
  @SwaggerGet({
    description: "Отримання записів після м'якого видалення",
    summary: "Отримання записів після м'якого видалення",
    example200: examples.get200,
  })
  findDeletedAll() {
    return this.propertyService.findDeletedAll();
  }

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
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const result = await this.propertyService.update(uuid, updatePropertyDto);
    return new CustomApiResponse(result, 'Updated', HttpStatus.OK);
  }

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

  @Delete(':uuid')
  @SwaggerDelete()
  @ApiParam({ name: 'uuid', example: '4deedf09-b86d-4799-ab10-ae1424471540' })
  async remove(@Param('uuid') uuid: string) {
    const response = await this.propertyService.softDelete(uuid);
    return new CustomApiResponse(response, 'Delete', HttpStatus.OK);
  }
}
