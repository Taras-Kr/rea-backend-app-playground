import { BaseEntity } from '../../../entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CharacteristicValue } from '../../characteristic-value/entities/characteristic-value.entity';

export enum PropertyCharacteristicsType {
  NUMBER = 1,
  STRING = 2,
  SELECT = 3,
  SWITCH = 4,
}

@Entity('property_characteristics')
export class PropertyCharacteristic extends BaseEntity {
  @Column('varchar', {
    name: 'name',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({ type: 'enum', name: 'type', enum: PropertyCharacteristicsType })
  type: number;

  @Column('boolean', { name: 'is_multiple', default: false })
  is_multiple: boolean;

  @Column('varchar', { name: 'description', nullable: true, length: 250 })
  description: string;

  @OneToMany(() => CharacteristicValue, (value) => value.characteristic)
  values: CharacteristicValue[];
}
