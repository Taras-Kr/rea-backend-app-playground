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
import { PropertyCharacteristicService } from './property-characteristic.service';
import { CreatePropertyCharacteristicDto } from './dto/create-property-characteristic.dto';
import { UpdatePropertyCharacteristicDto } from './dto/update-property-characteristic.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
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
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';
import { ApiResponse } from '../../common/dto/api-response.dto';

@Controller('/handbooks/property-characteristics')
@ApiTags("Довідник характеристик об'єкта нерухомості")
export class PropertyCharacteristicController {
  constructor(
    private readonly propertyCharacteristicService: PropertyCharacteristicService,
  ) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення нового запису про об'єкт нерухомості",
    summary: "Створення нового запису про об'єкт нерухомості",
    example400: examples.create400,
    example422: examples.create422,
    example201: examples.create201,
  })
  async create(
    @Body() createPropertyCharacteristicDto: CreatePropertyCharacteristicDto,
  ) {
    const result = await this.propertyCharacteristicService.create(
      createPropertyCharacteristicDto,
    );
    return new ApiResponse(result, 'Created', HttpStatus.CREATED);
  }

  @Get('archive')
  @SwaggerGetArchive({
    example200: examples.getArchive200,
  })
  findDeletedAll() {
    return this.propertyCharacteristicService.findDeletedAll();
  }

  @Get()
  @SwaggerGet({
    example200: examples.get200,
  })
  findAll() {
    return this.propertyCharacteristicService.findAll();
  }

  @Get(':uuid')
  @SwaggerGetByUUID({
    description:
      "Отримання не видаленого запису про характеристику об'єкту нерухомості",
    summary:
      "Отримання не видаленого запису про характеристику об'єкту нерухомості",
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.propertyCharacteristicService.findOne(uuid);
  }

  @Put('archive/:uuid')
  @SwaggerRestore({
    description:
      "Поновлення з архіву після м'якого видалення характеристики об'єкта нерухомості",
    summary:
      "Поновлення з архіву після м'якого видалення характеристики об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const response = await this.propertyCharacteristicService.restore(uuid);
    return new ApiResponse(response, 'Restored', HttpStatus.OK);
  }

  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: "Редагування характеристики об'єкта нерухомості",
    summary: "Редагування характеристики об'єкта нерухомості",
    example422: examples.update422,
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyCharacteristicDto: UpdatePropertyCharacteristicDto,
  ) {
    const response = await this.propertyCharacteristicService.update(
      uuid,
      updatePropertyCharacteristicDto,
    );
    return new ApiResponse(response, 'Updated', HttpStatus.OK);
  }

  @Delete(':uuid')
  @SwaggerDelete({
    description: 'М`яке видалення запису характеристики нерухомості',
    summary: 'М`яке видалення запису характеристики нерухомості',
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async softDelete(@Param('uuid') uuid: string) {
    const response = await this.propertyCharacteristicService.softDelete(uuid);
    return new ApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
