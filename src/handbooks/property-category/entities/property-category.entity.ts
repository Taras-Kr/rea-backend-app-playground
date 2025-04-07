import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import slugify from 'slugify';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { PropertyType } from '../../property-type/entities/property-type.entity';

@Entity({ name: 'property-categories' })
export class PropertyCategory extends BaseEntity {
  @Column('varchar', {
    name: 'name',
    length: 100,
    unique: true,
  })
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Column('varchar', { name: 'slug', nullable: false, length: 100 })
  slug: string;

  @OneToMany(() => PropertyType, (propertyType) => propertyType.category)
  propertyTypes: PropertyType[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
