import { Module } from '@nestjs/common';
import { PropertyCharacteristicValueService } from './property-characteristic-value.service';
import { PropertyCharacteristicValueController } from './property-characteristic-value.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCharacteristicValue } from './entities/property-characteristic-value.entity';
import { PropertyCharacteristicService } from '../property-characteristic/property-characteristic.service';
import { PropertyCharacteristic } from '../property-characteristic/entities/property-characteristic.entity';
import { PropertyService } from '../../property/property.service';
import { LocationService } from '../../location/location.service';
import { PropertyTypeService } from '../property-type/property-type.service';
import { Property } from '../../property/entities/property.entity';
import { Location } from '../../location/entities/location.entity';
import { PropertyType } from '../property-type/entities/property-type.entity';
import { PropertyCategoryService } from '../property-category/property-category.service';
import { GeocodingService } from '../../geocoding/geocoding.service';
import { PropertyCategory } from '../property-category/entities/property-category.entity';
import { CharacteristicValue } from '../characteristic-value/entities/characteristic-value.entity';
import { CharacteristicValueService } from "../characteristic-value/characteristic-value.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyCharacteristicValue,
      PropertyCharacteristic,
      Property,
      PropertyType,
      Location,
      PropertyCategory,
      CharacteristicValue,
    ]),
  ],
  controllers: [PropertyCharacteristicValueController],
  providers: [
    PropertyCharacteristicValueService,
    PropertyCharacteristicService,
    PropertyService,
    PropertyTypeService,
    LocationService,
    PropertyCategoryService,
    GeocodingService,
    CharacteristicValueService,
  ],
})
export class PropertyCharacteristicValueModule {}
