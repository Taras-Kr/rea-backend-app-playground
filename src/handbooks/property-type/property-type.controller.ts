import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  UsePipes,
  Put,
} from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetArchive,
  SwaggerGetByUUID,
  SwaggerRestore,
  SwaggerUpdate,
} from '../../common/decorators/swagger/common.decorator';
import * as examples from './swagger/responses.swagger';

@ApiTags('Довідник типів нерухомості')
@Controller('handbooks/property-types')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: 'Створення запису про новий тип нерухомості',
    summary: 'Створення запису про новий тип нерухомості',
    example201: examples.create201,
    example422: examples.create422,
    example400: examples.create400,
  })
  async create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    const result = await this.propertyTypeService.create(createPropertyTypeDto);
    return new ApiResponse(result, 'Created', HttpStatus.CREATED);
  }

  @Get('archive')
  @SwaggerGetArchive({
    example200: examples.getArchive200,
  })
  findDeletedAll() {
    return this.propertyTypeService.findDeletedAll();
  }

  @Get()
  @SwaggerGet({
    description: 'Отримання всіх не видалених записів про типи нерухомості',
    summary: 'Отримання всіх не видалених записів про типи нерухомості',
    example200: examples.get200,
  })
  findAll() {
    return this.propertyTypeService.findAll();
  }

  @Get(':uuid')
  @SwaggerGetByUUID({
    description: 'Отримання не видаленого запису про типи нерухомості',
    summary: 'Отримання не видаленого запису про типи нерухомості',
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID типу нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.propertyTypeService.findOne(uuid);
  }

  @Put('archive/:uuid')
  @SwaggerRestore()
  @ApiParam({
    name: 'uuid',
    description: 'UUID типу нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const response = await this.propertyTypeService.restore(uuid);
    return new ApiResponse(response, 'Restored', HttpStatus.OK);
  }

  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: 'Редагування запису про тип нерухомості',
    summary: 'Редагування запису про тип нерухомості',
    example422: examples.update422,
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID типу нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyTypeDto: UpdatePropertyTypeDto,
  ) {
    const result = await this.propertyTypeService.update(
      uuid,
      updatePropertyTypeDto,
    );
    return new ApiResponse(result, 'Updated', HttpStatus.OK);
  }

  @Delete(':uuid')
  @SwaggerDelete()
  @ApiParam({
    name: 'uuid',
    description: 'UUID типу нерухомості',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async softDelete(@Param('uuid') uuid: string) {
    const response = await this.propertyTypeService.softDelete(uuid);
    return new ApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
