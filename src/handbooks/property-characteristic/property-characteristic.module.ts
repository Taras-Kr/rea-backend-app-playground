import { Module } from '@nestjs/common';
import { PropertyCharacteristicService } from './property-characteristic.service';
import { PropertyCharacteristicController } from './property-characteristic.controller';
import { PropertyCharacteristic } from './entities/property-characteristic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicValue } from '../characteristic-value/entities/characteristic-value.entity';
import { CharacteristicValueModule } from '../characteristic-value/characteristic-value.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyCharacteristic]),
    CharacteristicValueModule,
  ],
  controllers: [PropertyCharacteristicController],
  providers: [PropertyCharacteristicService],
  exports: [
    PropertyCharacteristicService,
    TypeOrmModule.forFeature([PropertyCharacteristic]),
  ],
})
export class PropertyCharacteristicModule {}
