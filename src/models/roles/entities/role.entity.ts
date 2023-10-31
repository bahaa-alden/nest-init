import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';
import { GROUPS, ROLE } from '../../../common';
import { Permission } from '../../permissions';
import { User } from '../../users';
import { Admin } from '../../admins';
import { Employee } from '../../employees';
import { GlobalEntity } from '../../../common';

@Entity({ name: 'roles' })
export class Role extends GlobalEntity {
  @Expose({ groups: [GROUPS.ROLE, GROUPS.ALL_ROLES] })
  @ApiProperty()
  @Column({ unique: true })
  name: ROLE | string;

  @Expose({ groups: [GROUPS.ROLE] })
  @ApiProperty({
    type: Permission,
    isArray: true,
  })
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'roleId' },
    inverseJoinColumn: { name: 'permissionId' },
  })
  permissions: Permission[];

  @Exclude()
  @OneToMany(() => User, (user) => user.role, { cascade: true })
  users: User[];

  @Exclude()
  @OneToMany(() => Admin, (admin) => admin.role, { cascade: true })
  admins: Admin[];

  @Exclude()
  @OneToMany(() => Employee, (employee) => employee.role, { cascade: true })
  employees: Employee[];
}
