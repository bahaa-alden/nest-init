import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IPermission } from '../interfaces/permissions.interface';
import { Action, Entities } from '../../../common/enums';
import { Role } from '../../roles/entities/role.entity';

import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { GROUPS } from '../../../common/enums/groups.enum';
import { Exclude, Expose } from 'class-transformer';

@Entity({})
@Unique('un_permission', ['action', 'subject'])
export class Permission implements IPermission {
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
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Expose({ groups: [GROUPS.PERMISSION] })
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
