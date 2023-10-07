import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IPermission } from '../interfaces';
import { Action, Entities } from '../../../common/enums';
import { Role } from '../../roles';
import { ApiProperty } from '@nestjs/swagger';
import { GROUPS } from '../../../common/enums';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'permissions' })
@Unique('un_permission', ['action', 'subject'])
export class Permission extends BaseEntity implements IPermission {
  @Expose({ groups: [GROUPS.PERMISSION, GROUPS.ALL_PERMISSIONS, GROUPS.ROLE] })
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({ groups: [GROUPS.PERMISSION, GROUPS.ALL_PERMISSIONS, GROUPS.ROLE] })
  @ApiProperty()
  @Column({ enum: Action })
  action: Action;

  @Expose({ groups: [GROUPS.PERMISSION, GROUPS.ALL_PERMISSIONS, GROUPS.ROLE] })
  @ApiProperty()
  @Column({ enum: Entities })
  subject: Entities;

  @Expose({ groups: [GROUPS.PERMISSION] })
  @ManyToMany(() => Role, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  roles: Role[];

  @Expose({ groups: [GROUPS.PERMISSION] })
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: [GROUPS.PERMISSION] })
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
