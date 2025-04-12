import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  constructor(private readonly configService: ConfigService) {}

  async getCoordinatesByAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            key: apiKey,
          },
        },
      );
      const result = response.data.results[0];
      if (!result) {
        throw new BadRequestException(
          'Не вдалося знайти координати для цієї адреси',
        );
      }
      const location = result.geometry.location;
      return {
        latitude: Number(location.lat),
        longitude: Number(location.lng),
      };
    } catch (error) {
      console.error(
        'Помилка при зверненні до Google Maps API:',
        error?.response?.data || error.message,
      );

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400) {
          throw new BadRequestException('Некоректна адреса');
        }

        if (status === 403 || status === 401) {
          throw new UnauthorizedException('API ключ недійсний або відсутній');
        }
      }

      throw new InternalServerErrorException(
        'Помилка при зверненні до Google Maps API',
      );
    }
  }
}
