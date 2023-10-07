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
import { GROUPS, ROLE } from '../../../common/enums';
import { Permission } from '../../permissions';
import { User } from '../../users';
import { Admin } from '../../admins';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Expose({ groups: [GROUPS.ROLE, GROUPS.ALL_ROLES] })
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({ groups: [GROUPS.ROLE, GROUPS.ALL_ROLES] })
  @ApiProperty()
  @Column({ unique: true })
  name: ROLE | string;

  @Expose({ groups: [GROUPS.ROLE] })
  @ApiProperty({
    type: OmitType,
    isArray: true,
  })
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable({})
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role, { cascade: true })
  users: User[];

  @OneToMany(() => Admin, (admin) => admin.role, { cascade: true })
  admins: Admin[];

  @Expose({ groups: [GROUPS.ROLE, GROUPS.ALL_ROLES] })
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: [GROUPS.ROLE, GROUPS.ALL_ROLES] })
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
