import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../entities/base.entity';
import { UserType } from '../../handbooks/user-type/entities/user-type.entity';
import { UserRole } from '../../handbooks/user-role/entities/user-role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'uuid' }) // Додаємо збереження UUID
  type_uuid: string;

  @ManyToOne(() => UserType)
  @JoinColumn({ name: 'type_uuid', referencedColumnName: 'uuid' })
  type: UserType;

  @ManyToOne(() => UserRole)
  @JoinColumn({ name: 'role_uuid', referencedColumnName: 'uuid' })
  role: UserRole;

  @Column({ type: 'uuid' }) // Додаємо збереження UUID
  role_uuid: string;
}
