import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [GeocodingController],
  providers: [GeocodingService],
  imports: [ConfigModule],
  exports: [GeocodingService],
})
export class GeocodingModule {}
