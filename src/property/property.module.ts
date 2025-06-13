import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyTypeService } from '../handbooks/property-type/property-type.service';
import { LocationService } from '../location/location.service';
import { PropertyType } from '../handbooks/property-type/entities/property-type.entity';
import { Location } from '../location/entities/location.entity';
import { PropertyCategoryService } from '../handbooks/property-category/property-category.service';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PropertyCategory } from '../handbooks/property-category/entities/property-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyType,
      Location,
      PropertyCategory,
    ]),
  ],
  controllers: [PropertyController],
  providers: [
    PropertyService,
    PropertyTypeService,
    LocationService,
    PropertyCategoryService,
    GeocodingService,
  ],
})
export class PropertyModule {}
