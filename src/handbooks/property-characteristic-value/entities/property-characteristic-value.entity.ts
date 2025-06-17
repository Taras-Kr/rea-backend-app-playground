import { BaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PropertyCharacteristic } from '../../property-characteristic/entities/property-characteristic.entity';
import { Property } from '../../../property/entities/property.entity';

@Entity({ name: 'property_characteristic_values' })
export class PropertyCharacteristicValue extends BaseEntity {
  @ManyToOne(
    () => Property,
    (property) => property.property_characteristic_values,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'property_uuid' })
  property: Property;

  @ManyToOne(
    () => PropertyCharacteristic,
    (property_characteristic) =>
      property_characteristic.property_characteristic_values,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: `property_characteristic_uuid` })
  property_characteristic: PropertyCharacteristic;

  @Column({ type: 'jsonb' })
  value: number | string | Array<string> | boolean;
}
