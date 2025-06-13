import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { CharacteristicValueService } from './characteristic-value.service';
import { CreateCharacteristicValueDto } from './dto/create-characteristic-value.dto';
import { UpdateCharacteristicValueDto } from './dto/update-characteristic-value.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomApiResponse as Response } from '../../common/dto/api-response.dto';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetByUUID,
  SwaggerUpdate,
} from '../../common/decorators/swagger/common.decorator';
import * as examples from './swagger/responses.swagger';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';

@ApiTags("Значення характеристик об'єктів нерухомості")
@Controller('/handbooks/property-characteristics')
export class CharacteristicValueController {
  constructor(
    private readonly characteristicValueService: CharacteristicValueService,
  ) {}

  @Post(':property_characteristic_uuid/values')
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description:
      "Створення значення для характеристики нерухомості, що має тип 'Вибір із списку'",
    summary: 'Створення значення для характеристики нерухомості',
    example201: examples.create201,
    example422: examples.create422,
    example400: examples.create400,
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Характеристика не існує або видалена',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiParam({
    name: 'property_characteristic_uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async createCharacteristicValue(
    @Param('property_characteristic_uuid') uuid: string,
    @Body()
    createCharacteristicValue: CreateCharacteristicValueDto,
  ) {
    const result =
      await this.characteristicValueService.createCharacteristicValue(
        uuid,
        createCharacteristicValue,
      );
    return new Response(result, 'Created', HttpStatus.CREATED);
  }

  @Get(':property_characteristic_uuid/values')
  @SwaggerGet({
    description: "Отримання всіх значень для характеристик об'єкта нерухомості",
    summary: "Отримання всіх значень для характеристик об'єкта нерухомості",
    example200: examples.get200,
  })
  @ApiResponse({
    status: 404,
    example: {
      message: 'Характеристика не існує або видалена',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'Incorrect UUID',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiParam({
    name: 'property_characteristic_uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findAll(@Param('property_characteristic_uuid') uuid: string) {
    return this.characteristicValueService.findAll(uuid);
  }

  @Get(':property_characteristic_uuid/values/:values_uuid')
  @SwaggerGetByUUID({
    description: "Отримати значення характеристики об'єкта нерухомості",
    summary: "Отримати значення характеристики об'єкта нерухомості",
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'property_characteristic_uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  @ApiParam({
    name: 'values_uuid',
    description: "UUID значення характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(
    @Param('property_characteristic_uuid') property_characteristic_uuid: string,
    @Param('values_uuid') values_uuid: string,
  ) {
    return this.characteristicValueService.findOne(
      property_characteristic_uuid,
      values_uuid,
    );
  }

  @Put(':property_characteristic_uuid/values/:value_uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: "Редагування значення характеристики об'єкта нерухомості",
    summary: "Редагування значення характеристики об'єкта нерухомості",
  })
  @ApiParam({
    name: 'property_characteristic_uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  @ApiParam({
    name: 'values_uuid',
    description: "UUID значення характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('property_characteristic_uuid') property_characteristic_uuid: string,
    @Param('value_uuid') value_uuid: string,
    @Body() updateCharacteristicValueDto: UpdateCharacteristicValueDto,
  ) {
    const response = await this.characteristicValueService.update(
      property_characteristic_uuid,
      value_uuid,
      updateCharacteristicValueDto,
    );
    return new Response(response, 'Updated', HttpStatus.OK);
  }

  @Delete(':property_characteristic_uuid/values/:value_uuid')
  @SwaggerDelete({
    description:
      "Жорстке видалення значення характеристики об'єкта нерухомості",
    summary: "Жорстке видалення значення характеристики об'єкта нерухомості",
  })
  @ApiParam({
    name: 'property_characteristic_uuid',
    description: "UUID характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  @ApiParam({
    name: 'values_uuid',
    description: "UUID значення характеристики об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async remove(
    @Param('property_characteristic_uuid') property_characteristic_uuid: string,
    @Param('value_uuid') value_uuid: string,
  ) {
    const response = await this.characteristicValueService.remove(
      property_characteristic_uuid,
      value_uuid,
    );
    return new Response(response, 'Deleted', HttpStatus.OK);
  }
}
