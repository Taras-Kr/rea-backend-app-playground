import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PropertyImageService } from './property-image.service';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import {
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetByUUID,
  SwaggerUpdate,
} from '../common/decorators/swagger/common.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomApiResponse } from '../common/dto/api-response.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags("Зображення об'єкта нерухомості")
@Controller('property-images')
export class PropertyImageController {
  constructor(private readonly propertyImageService: PropertyImageService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Post('property/:property_uuid')
  @UsePipes(new CustomValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  uploadAndSave(
    @Param('property_uuid') property_uuid: string,
    @Body() createPropertyImageDto: CreatePropertyImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.propertyImageService.uploadAndSaveFile(
      property_uuid,
      createPropertyImageDto,
      file,
    );
  }

  @Get()
  @SwaggerGet({
    description: 'Отримання всіх зображень',
    summary: 'Отримання всіх зображень',
    // example200
  })
  findAll() {
    return this.propertyImageService.findAll();
  }

  @Get(':uuid')
  @SwaggerGetByUUID({
    description: 'Отримання зображення за UUID',
    summary: 'Отримання зображення за UUID',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID зображення',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async findOne(@Param('uuid') uuid: string) {
    return this.propertyImageService.findOne(uuid);
  }

  @Get('/property/:property_uuid')
  @SwaggerGet({
    description: "Отримання всіх зображень об'єкта нерухомості",
    summary: "Отримання всіх зображень об'єкта нерухомості",
  })
  @ApiParam({
    name: 'property_uuid',
    description: "UUID об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async findByPropertyUuid(@Param('property_uuid') property_uuid: string) {
    return this.propertyImageService.findByPropertyUuid(property_uuid);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Put(':uuid')
  @SwaggerUpdate({
    description: 'Оновлення атрибутів зображення',
    summary: 'Оновлення атрибутів зображення',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID зображення',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyImageDto: UpdatePropertyImageDto,
  ) {
    const response = await this.propertyImageService.update(
      uuid,
      updatePropertyImageDto,
    );
    return new CustomApiResponse(response, 'Updated', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Delete(':uuid')
  @SwaggerDelete({
    description: 'Жорстке видалення зображення з галереї',
    summary: 'Жорстке видалення зображення з галереї',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID зображення',
  })
  async delete(@Param('uuid') uuid: string) {
    const response = await this.propertyImageService.delete(uuid);
    return new CustomApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
