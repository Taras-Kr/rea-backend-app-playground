import { forwardRef, Module } from '@nestjs/common';
import { CharacteristicValueService } from './characteristic-value.service';
import { CharacteristicValueController } from './characteristic-value.controller';
import { CharacteristicValue } from './entities/characteristic-value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCharacteristicModule } from '../property-characteristic/property-characteristic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacteristicValue]),
    forwardRef(() => PropertyCharacteristicModule),
  ],
  controllers: [CharacteristicValueController],
  providers: [CharacteristicValueService],
  exports: [CharacteristicValueService],
})
export class CharacteristicValueModule {}
