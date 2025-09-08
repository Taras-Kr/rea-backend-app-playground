import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Property } from '../../property/entities/property.entity';
import { PropertyImage } from '../../property-image/entities/property-image.entity';

@Entity({ name: 'image-galleries' })
export class ImageGallery extends BaseEntity {
  @OneToOne(() => Property, (property) => property.gallery)
  @JoinColumn({ name: 'property_uuid', referencedColumnName: 'uuid' })
  property: Property;

  @Column('uuid', { nullable: true, name: 'property_uuid' })
  property_uuid: string;

  @OneToMany(() => PropertyImage, (propertyImage) => propertyImage.gallery)
  propertyImages: PropertyImage[];

  @Column('varchar', { nullable: true, name: 'description' })
  description: string;
}
