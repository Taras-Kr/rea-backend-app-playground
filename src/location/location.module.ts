import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { GeocodingService } from '../geocoding/geocoding.service';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), GeocodingModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
