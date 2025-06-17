import { BaseEntity } from '../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PropertyType } from '../../handbooks/property-type/entities/property-type.entity';
import { Location } from '../../location/entities/location.entity';
import { PropertyCharacteristicValue } from '../../handbooks/property-characteristic-value/entities/property-characteristic-value.entity';

@Entity({ name: 'properties' })
export class Property extends BaseEntity {
  @Column('varchar', {
    name: 'title',
    length: 150,
    nullable: false,
  })
  title: string;

  //Один об'єкт має один тип, один тип може належати багатьом об'єктам
  @ManyToOne(() => PropertyType, (propertyType) => propertyType.properties, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: `property_type_uuid` }) //назва зовнішнього ключа
  property_type: PropertyType;

  @ManyToOne(() => Location, (location) => location.properties, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: `location_uuid` })
  location: Location;

  @OneToMany(
    () => PropertyCharacteristicValue,
    (propertyCharacteristicValues) => propertyCharacteristicValues.property,
  )
  property_characteristic_values: PropertyCharacteristicValue[];

  @Column('boolean', {
    default: false,
    name: 'is_published',
  })
  is_published: boolean;

  @Column('uuid', { nullable: true, name: 'gallery_uuid' })
  gallery_uuid: string;
}
