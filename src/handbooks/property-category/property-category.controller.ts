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
import { PropertyCategoryService } from './property-category.service';
import { CreatePropertyCategoryDto } from './dto/create-property-category.dto';
import { UpdatePropertyCategoryDto } from './dto/update-property-category.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';

@Controller('handbooks/property-categories')
export class PropertyCategoryController {
  constructor(
    private readonly propertyCategoryService: PropertyCategoryService,
  ) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  create(@Body() createPropertyCategoryDto: CreatePropertyCategoryDto) {
    return this.propertyCategoryService.create(createPropertyCategoryDto);
  }

  @Get('archive')
  findAllDeleted() {
    return this.propertyCategoryService.findDeletedAll();
  }

  @Get()
  findAll() {
    return this.propertyCategoryService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.propertyCategoryService.findOne(uuid);
  }

  @Put('archive/:uuid')
  async restore(@Param('uuid') uuid: string) {
    const res = await this.propertyCategoryService.restore(uuid);
    return new ApiResponse(res, 'Restored', HttpStatus.OK);
  }

  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  update(
    @Param('uuid') uuid: string,
    @Body() updatePropertyCategoryDto: UpdatePropertyCategoryDto,
  ) {
    return this.propertyCategoryService.update(uuid, updatePropertyCategoryDto);
  }

  @Delete(':uuid')
  async softDelete(@Param('uuid') uuid: string) {
    const res = await this.propertyCategoryService.softDelete(uuid);
    return new ApiResponse(res, 'Deleted', HttpStatus.OK);
  }
}
