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
import { PropertyCategoryService } from './property-category.service';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomApiResponse as ApiResponseType } from '../../common/dto/api-response.dto';
import * as examples from './swagger/responses.swagger';

import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetArchive,
  SwaggerGetByUUID,
  SwaggerRestore,
  SwaggerUpdate,
} from '../../common/decorators/swagger/common.decorator';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags("Довідник категорій  об'єктів нерухомості")
@Controller('handbooks/property-categories')
export class PropertyCategoryController {
  constructor(
    private readonly propertyCategoryService: PropertyCategoryService,
  ) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення запису про нову категорію об'єктів нерухомості",
    summary: "Створення запису про нову категорію об'єктів нерухомості",
    example201: examples.create201,
    example400: examples.create400,
    example422: examples.create422,
  })
  create(@Body() createPropertyCategoryDto: CreatePropertyCategoryDto) {
    return this.propertyCategoryService.create(createPropertyCategoryDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get('archive')
  @SwaggerGetArchive({
    example200: examples.getArchive200,
  })
  findAllDeleted() {
    return this.propertyCategoryService.findDeletedAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get()
  @SwaggerGet({
    example200: examples.get200,
    description:
      "Отримання всіх не видалених записів про категорії об'єктів нерухомості",
    summary:
      "Отримання всіх не видалених записів про категорії об'єктів нерухомості",
  })
  findAll() {
    return this.propertyCategoryService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get(':uuid')
  @SwaggerGetByUUID({
    example200: examples.getByUuid200,
    description:
      "Отримання не видаленого запису про категорію об'єктів нерухомості",
    summary:
      "Отримання не видаленого запису про категорію  об'єктів нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.propertyCategoryService.findOne(uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Put('archive/:uuid')
  @SwaggerRestore({
    description: "Поновлення з архіву категорії об'єкта нерухомості за UUID",
    summary:
      "Поновлення з архіву категорії об'єкта нерухомості після м'якого видалення",
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const res = await this.propertyCategoryService.restore(uuid);
    return new ApiResponseType(res, 'Restored', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: "Редагування категорії об'єкта нерухомості",
    summary: "Редагування категорії об'єкта нерухомості",
    example422: examples.update422,
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    const res = await this.propertyCategoryService.update(
      uuid,
      updatePropertyCategoryDto,
    );
    return new ApiResponseType(res, 'Updated', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Delete(':uuid')
  @SwaggerDelete({
    description: "М'яке видалення категорії об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async softDelete(@Param('uuid') uuid: string) {
    const res = await this.propertyCategoryService.softDelete(uuid);
    return new ApiResponseType(res, 'Deleted', HttpStatus.OK);
  }
}
