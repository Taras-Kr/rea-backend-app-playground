import { Controller, Get, Query } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('geocoding')
@ApiTags('Геокодування (Геолокація)')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Get('coordinates')
  @ApiOperation({
    description:
      'Отримання довготи та широти за адресою.  \nПриклади адрес:\n1. Київ.\n2. місто Київ, вулиця Велика Васильківська.\n3. місто Київ, вулиця Велика Васильківська, 125',
    summary: 'Отримання довготи та широти за адресою',
  })
  @ApiResponse({
    status: 200,
    example: {
      data: {
        latitude: 49.1557117,
        longitude: 23.8674568,
      },
      message: 'Success',
      statusCode: 200,
    },
  })
  @ApiResponse({
    status: 500,
    example: {
      message: 'Помилка при зверненні до Google Maps API',
      error: 'Internal Server Error',
      statusCode: 500,
    },
  })
  @ApiParam({
    name: 'address',
    description:
      'Адреса.  \nПриклади адрес:  \n1. Київ.  \n2. місто Київ, вулиця Велика Васильківська.  \n3. місто Київ, вулиця Велика Васильківська, 125',
    example: 'місто Київ, вул. Велика Васильківська, 125',
  })
  async getCoordinates(@Query('address') address: string) {
    return this.geocodingService.getCoordinatesByAddress(address);
  }
}
