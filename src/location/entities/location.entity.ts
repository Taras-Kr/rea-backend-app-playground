import { BaseEntity } from '../../entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'locations' })
export class Location extends BaseEntity {
  @Column('varchar', { nullable: true, length: 100 })
  community?: string;

  @Column('varchar', { length: 100 })
  settlement: string;

  @Column('varchar', { nullable: true, length: 100 })
  district?: string;

  @Column('varchar', { nullable: true, length: 100 })
  street?: string;

  @Column('varchar', { nullable: true, length: 6 })
  building_number?: string;

  @Column('varchar', { nullable: true, length: 6 })
  apartment_number?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal', { precision: 9, scale: 6, nullable: true, default: 0 })
  latitude?: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true, default: 0 })
  longitude?: number;
}
