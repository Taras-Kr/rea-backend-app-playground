import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ImageGalleryService } from './image-gallery.service';
import { CreateImageGalleryDto } from './dto/create-image-gallery.dto';
import { UpdateImageGalleryDto } from './dto/update-image-gallery.dto';
import { CustomApiResponse } from '../common/dto/api-response.dto';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { SwaggerCreate } from '../common/decorators/swagger/common.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Галерея зображень')
@Controller('image-galleries')
export class ImageGalleryController {
  constructor(private readonly imageGalleryService: ImageGalleryService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення значення характеристики об'єкту нерухомості",
    summary: "Створення значення характеристики об'єкту нерухомості",
    // example201 = examples.create201;
  })
  async create(@Body() createImageGalleryDto: CreateImageGalleryDto) {
    const response = await this.imageGalleryService.create(
      createImageGalleryDto,
    );
    return new CustomApiResponse(response, 'Success', HttpStatus.CREATED);
  }

  @Get()
  findAll() {
    return this.imageGalleryService.findAll();
  }

  @Get('/property/:property_uuid')
  @SwaggerCreate({
    description: "Отримання галереї за UUID об'єкта нерухомості",
    summary: "Отримання галереї за UUID об'єкта нерухомості",
  })
  @ApiParam({
    name: 'property_uuid',
    example: 'cc2fc8ec-ffd0-4a28-891d-145b16e82c48',
    description: "UUID об'єкта нерухомості",
  })
  async galleryByPropertyUuid(@Param('property_uuid') propertyUuid: string) {
    return this.imageGalleryService.findByProperty(propertyUuid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageGalleryService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateImageGalleryDto: UpdateImageGalleryDto,
  ) {
    return this.imageGalleryService.update(+id, updateImageGalleryDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageGalleryService.remove(+id);
  }
}
