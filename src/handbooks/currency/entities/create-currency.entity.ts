import { BaseEntity } from '../../../entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency extends BaseEntity {
  @Column('varchar', { name: 'name', nullable: false, length: 20 })
  name: string;
  @Column('varchar', { name: 'code', nullable: false, length: 3 })
  code: string;
  @Column('varchar', { name: 'symbol', nullable: false, length: 3 })
  symbol: string;
}
