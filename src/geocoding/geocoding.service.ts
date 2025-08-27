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
    //   console.error(
    //     'Помилка при зверненні до Google Maps API:',
    //     error?.response?.data || error.message,
    //   );
    //
    //   if (axios.isAxiosError(error)) {
    //     const status = error.response?.status;
    //
    //     if (status === 400) {
    //       throw new BadRequestException('Некоректна адреса');
    //     }
    //
    //     if (status === 403 || status === 401) {
    //       throw new UnauthorizedException('API ключ недійсний або відсутній');
    //     }
    //   }
    //
    //   throw new InternalServerErrorException(
    //     'Помилка при зверненні до Google Maps API',
    //   );// Спочатку обробляємо наші кастомні винятки, щоб зберегти їх статус-код.
      //       if (error instanceof BadRequestException || error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
      //         console.error('Вихідна NestJS помилка:', error.message);
      //         throw error;
      //       }
      //
      //       // Потім обробляємо помилки від Axios, якщо вони є.
      //       if (axios.isAxiosError(error)) {
      //         const status = error.response?.status;
      //         const responseData = error.response?.data;
      //
      //         // Логуємо повну відповідь для діагностики.
      //         console.error(
      //           'Помилка Axios при зверненні до Google Maps API:',
      //           `Статус: ${status}`,
      //           'Дані відповіді:',
      //           responseData,
      //         );
      //
      //         if (status === 400) {
      //           throw new BadRequestException('Некоректна адреса');
      //         }
      //
      //         if (status === 403 || status === 401) {
      //           throw new UnauthorizedException('API ключ недійсний або відсутній');
      //         }
      //       }
      //
      //       // Якщо помилка не була оброблена вище, вважаємо її загальною внутрішньою помилкою.
      //       console.error('Невідома помилка при зверненні до Google Maps API:', error);
      //       throw new InternalServerErrorException(
      //         'Помилка при зверненні до Google Maps API',
      //       );
//// Спочатку обробляємо наші кастомні винятки, щоб зберегти їх статус-код.
      if (error instanceof BadRequestException || error instanceof UnauthorizedException || error instanceof InternalServerErrorException) {
        console.error('Вихідна NestJS помилка:', error.message);
        throw error;
      }

      // Потім обробляємо помилки від Axios, якщо вони є.
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        // Логуємо повну відповідь для діагностики.
        console.error(
          'Помилка Axios при зверненні до Google Maps API:',
          `Статус: ${status}`,
          'Дані відповіді:',
          responseData,
        );

        if (status === 400) {
          // Логуємо деталі помилки від Google API
          if (responseData && responseData.status === 'ZERO_RESULTS') {
            console.error('Google Maps API повернув статус "ZERO_RESULTS" для адреси:', address);
            throw new BadRequestException('Не вдалося знайти координати для цієї адреси. Перевірте написання.');
          }
          throw new BadRequestException('Некоректна адреса');
        }

        if (status === 403 || status === 401) {
          throw new UnauthorizedException('API ключ недійсний або відсутній');
        }
      }

      // Якщо помилка не була оброблена вище, вважаємо її загальною внутрішньою помилкою.
      console.error('Невідома помилка при зверненні до Google Maps API:', error);
      throw new InternalServerErrorException(
        'Помилка при зверненні до Google Maps API',
      );

    }
  }
}
