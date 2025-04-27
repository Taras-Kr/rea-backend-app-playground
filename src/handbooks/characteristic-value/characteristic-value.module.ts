import { Module } from '@nestjs/common';
import { CharacteristicValueService } from './characteristic-value.service';
import { CharacteristicValueController } from './characteristic-value.controller';
import { CharacteristicValue } from './entities/characteristic-value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCharacteristic } from '../property-characteristic/entities/property-characteristic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacteristicValue, PropertyCharacteristic]),
  ],
  controllers: [CharacteristicValueController],
  providers: [CharacteristicValueService],
})
export class CharacteristicValueModule {}
