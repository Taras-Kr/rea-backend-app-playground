import { Module } from '@nestjs/common';
import { PropertyCharacteristicService } from './property-characteristic.service';
import { PropertyCharacteristicController } from './property-characteristic.controller';
import { PropertyCharacteristic } from './entities/property-characteristic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicValue } from '../characteristic-value/entities/characteristic-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyCharacteristic, CharacteristicValue]),
  ],
  controllers: [PropertyCharacteristicController],
  providers: [PropertyCharacteristicService],
})
export class PropertyCharacteristicModule {}
