import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { PropertyCategory } from '../../property-category/entities/property-category.entity';
import slugify from 'slugify';
import { Property } from '../../../property/entities/property.entity';

@Entity({ name: 'property_types' })
export class PropertyType extends BaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 100,
    unique: true,
  })
  name: string;

  @Column('varchar', {
    name: 'slug',
    nullable: false,
    length: 100,
    unique: true,
  })
  slug: string;

  @Column('varchar', {
    name: 'description',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => PropertyCategory, (category) => category.propertyTypes)
  @JoinColumn({ name: 'category_uuid', referencedColumnName: 'uuid' })
  category: PropertyCategory;

  @Column({ type: 'uuid', name: 'category_uuid', nullable: false })
  category_uuid: string;

  @OneToMany(() => Property, (property) => property.property_type)
  properties: Property[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
