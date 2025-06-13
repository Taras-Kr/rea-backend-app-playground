import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetArchive,
  SwaggerGetByUUID,
  SwaggerRestore,
  SwaggerUpdate,
} from '../common/decorators/swagger/common.decorator';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import * as examples from './swagger/responses.swagger';
import { CustomApiResponse } from '../common/dto/api-response.dto';

@ApiTags("Локації об'єктів нерухомості (адреси)")
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: "Створення нового запису про локацію об'єкту нерухомості",
    summary: "Створення нового запису про локацію об'єкту нерухомості",
    example400: examples.create400,
    example201: examples.create201,
  })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get('archive')
  @SwaggerGetArchive({
    example200: examples.getArchive200,
  })
  findDeletedAll() {
    return this.locationService.findDeletedAll();
  }

  @Get()
  @SwaggerGet({
    description: 'Отримання всіх не видалених записів локацій',
    summary: 'Отримання всіх не видалених записів локацій',
    example200: examples.get200,
  })
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':uuid')
  @SwaggerGetByUUID({
    description: 'Отримання не видаленого запису про локацію',
    summary: 'Отримання не видаленого запису про локацію',
    example200: examples.get200,
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID локації',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.locationService.findOne(uuid);
  }

  @Put('archive/:uuid')
  @SwaggerRestore()
  @ApiParam({
    name: 'uuid',
    description: 'UUID локації',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const result = await this.locationService.restore(uuid);
    return new CustomApiResponse(result, 'Restored', HttpStatus.OK);
  }

  @Put(':uuid/coordinates')
  @SwaggerUpdate({
    description: "Визначення довготи та широти із адреси об'єкта нерухомості",
    summary: "Визначення довготи та широти із адреси об'єкта нерухомості",
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID локації',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async updateCoordinates(@Param('uuid') uuid: string) {
    const response = await this.locationService.updateCoordinates(uuid);
    return new CustomApiResponse(response, 'Updated', HttpStatus.OK);
  }

  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate()
  @ApiParam({
    name: 'uuid',
    description: 'UUID локації',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const response = await this.locationService.update(uuid, updateLocationDto);
    return new CustomApiResponse(response, 'Updated', HttpStatus.OK);
  }

  @Delete(':uuid')
  @SwaggerDelete()
  async remove(@Param('uuid') uuid: string) {
    const response = await this.locationService.softDelete(uuid);
    return new CustomApiResponse(response, 'Deleted', HttpStatus.OK);
  }
}
