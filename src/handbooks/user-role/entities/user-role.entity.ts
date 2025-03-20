import { BaseEntity } from '../../../entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserType } from '../../user-type/entities/user-type.entity';

@Entity({ name: 'user_roles' })
export class UserRole extends BaseEntity {
  @Column('varchar', { name: 'role', nullable: false, length: 40 })
  role: string;
  @Column('varchar', { name: 'title', nullable: false, length: 40 })
  title: string;

  @ManyToOne(() => UserType)
  @JoinColumn({ name: 'type_uuid', referencedColumnName: 'uuid' })
  type: UserType;

  @Column({ type: 'uuid', nullable: false })
  type_uuid: string;
}
