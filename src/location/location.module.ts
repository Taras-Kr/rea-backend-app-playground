import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { GeocodingService } from '../geocoding/geocoding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, GeocodingService],
})
export class LocationModule {}
