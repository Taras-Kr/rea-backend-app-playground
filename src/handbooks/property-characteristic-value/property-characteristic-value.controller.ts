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
import { PropertyCharacteristicValueService } from './property-characteristic-value.service';
import { CreatePropertyCharacteristicValueDto } from './dto/create-property-characteristic-value.dto';
import { UpdatePropertyCharacteristicValueDto } from './dto/update-property-characteristic-value.dto';
import * as examples from './swagger/responses.swagger';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetByUUID,
  SwaggerUpdate,
} from '../../common/decorators/swagger/common.decorator';
import { CustomApiResponse } from '../../common/dto/api-response.dto';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePropertyCharacteristicsBatchDto } from './dto/create-property-characteristics-batch.dto';

@ApiTags("Значення характеристики об'єкта нерухомості")
@Controller('property-characteristic-value')
export class PropertyCharacteristicValueController {
  constructor(
    private readonly propertyCharacteristicValueService: PropertyCharacteristicValueService,
  ) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення значення характеристики об'єкту нерухомості",
    summary: "Створення значення характеристики об'єкту нерухомості",
    // example201 = examples.create201;
  })
  async create(
    @Body()
    createPropertyCharacteristicValueDto: CreatePropertyCharacteristicValueDto,
  ) {
    const response = await this.propertyCharacteristicValueService.create(
      createPropertyCharacteristicValueDto,
    );
    return new CustomApiResponse(response, 'Created', HttpStatus.CREATED);
  }

  @Post(':property_uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Додавання значень характеристик об'єкта нерухомості",
    summary: "Додавання значень характеристик об'єкта нерухомості",
  })
  @ApiParam({
    name: 'property_uuid',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
    description: "UUID характеристики об'єкту нерухомості",
  })
  @ApiBody({ type: [CreatePropertyCharacteristicsBatchDto] })
  async createBatch(
    @Param('property_uuid') property_uuid: string,
    @Body() batch: CreatePropertyCharacteristicsBatchDto[],
  ) {
    const response =
      await this.propertyCharacteristicValueService.createPropertyCharacteristicValueBatch(
        property_uuid,
        batch,
      );
    return new CustomApiResponse(response, 'Created', HttpStatus.CREATED);
  }

  @Get()
  @SwaggerGet({
    description:
      "Отримання всіх не видалених записів про значення характеристики нерухомості об'єкта нерухомості",
    summary:
      "Отримання всіх не видалених записів про значення характеристики нерухомості об'єкта нерухомості",
  })
  findAll() {
    return this.propertyCharacteristicValueService.findAll();
  }

  @Get(':uuid')
  @SwaggerGetByUUID({
    description: 'Отримання всіх значень характеристик нерухомості',
    summary: 'Отримання всіх значень характеристик нерухомості',
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'uuid',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
    description: "UUID значення характеристики об'єкту нерухомості",
  })
  findOne(@Param('uuid') uuid: string) {
    return this.propertyCharacteristicValueService.findOne(uuid);
  }

  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: "Оновлення значення характеристики об'єкта нерухомості",
    summary: "Оновлення значення характеристики об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
    description: "UUID значення характеристики об'єкту нерухомості",
  })
  async update(
    @Param('uuid') uuid: string,
    @Body()
    updatePropertyCharacteristicValueDto: UpdatePropertyCharacteristicValueDto,
  ) {
    const response = await this.propertyCharacteristicValueService.update(
      uuid,
      updatePropertyCharacteristicValueDto,
    );
    return new CustomApiResponse(response, 'Updated', HttpStatus.OK);
  }

  @Delete(':uuid')
  @SwaggerDelete({
    description:
      "Жорстке видалення запису про значення характеристики об'єкта нерухомості",
    summary:
      "Жорстке видалення запису про значення характеристики об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
    description: "UUID значення характеристики об'єкту нерухомості",
  })
  async remove(@Param('uuid') uuid: string) {
    const response = await this.propertyCharacteristicValueService.remove(uuid);
    return new CustomApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
