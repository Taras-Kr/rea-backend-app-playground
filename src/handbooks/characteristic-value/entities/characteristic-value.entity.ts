import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PropertyCharacteristic } from '../../property-characteristic/entities/property-characteristic.entity';

@Entity('characteristic_value')
export class CharacteristicValue {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(
    () => PropertyCharacteristic,
    (characteristic) => characteristic.values,
  )
  @JoinColumn({ name: 'property_characteristic_uuid' })
  characteristic: PropertyCharacteristic;

  @Column('uuid', { name: 'property_characteristic_uuid' })
  property_characteristic_uuid: string;

  @Column('varchar', { name: 'value', length: 100, nullable: false })
  value: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
