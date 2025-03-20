import { BaseEntity } from '../../../entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user_types' })
export class UserType extends BaseEntity {
  @Column('varchar', { name: 'type', nullable: false, length: 40 })
  type: string;
  @Column('varchar', { name: 'title', nullable: false, length: 40 })
  title: string;
}
