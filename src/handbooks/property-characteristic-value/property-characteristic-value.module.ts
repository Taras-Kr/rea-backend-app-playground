import { Module } from '@nestjs/common';
import { PropertyCharacteristicValueService } from './property-characteristic-value.service';
import { PropertyCharacteristicValueController } from './property-characteristic-value.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCharacteristicValue } from './entities/property-characteristic-value.entity';
import { PropertyCharacteristicModule } from '../property-characteristic/property-characteristic.module';
import { PropertyModule } from '../../property/property.module';
import { CharacteristicValueModule } from '../characteristic-value/characteristic-value.module';
import { PropertyTypeModule } from '../property-type/property-type.module';
import { LocationModule } from '../../location/location.module';
import { PropertyCategoryModule } from '../property-category/property-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyCharacteristicValue]),
    PropertyCharacteristicModule,
    PropertyModule,
    PropertyTypeModule,
    LocationModule,
    PropertyCategoryModule,
    CharacteristicValueModule,
  ],
  controllers: [PropertyCharacteristicValueController],
  providers: [PropertyCharacteristicValueService],
  exports: [PropertyCharacteristicValueService],
})
export class PropertyCharacteristicValueModule {}
