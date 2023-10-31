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
import { Action, Entities } from '../../../common';
import { Role } from '../../roles';
import { ApiProperty } from '@nestjs/swagger';
import { GROUPS } from '../../../common';
import { Exclude, Expose } from 'class-transformer';
import { GlobalEntity } from '../../../common';

@Entity({ name: 'permissions' })
@Unique('un_permission', ['action', 'subject'])
export class Permission extends GlobalEntity implements IPermission {
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
}
