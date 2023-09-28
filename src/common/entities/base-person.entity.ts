import { UUID } from 'crypto';
// base-person.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../models/roles/entities/role.entity';
import { GROUPS } from '../enums/groups.enum';
import { generateHash } from '../helpers';

@Entity()
export class BasePerson extends BaseEntity {
  @BeforeInsert()
  async hash() {
    this.password = await generateHash(this.password);
  }

  @Expose({
    groups: [GROUPS.ALL_USERS, GROUPS.USER, GROUPS.ALL_ADMINS, GROUPS.ADMIN],
  })
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({
    groups: [GROUPS.ALL_USERS, GROUPS.USER, GROUPS.ALL_ADMINS, GROUPS.ADMIN],
  })
  @ApiProperty()
  @Column({})
  name: string;

  @Expose({
    groups: [GROUPS.ALL_USERS, GROUPS.USER, GROUPS.ALL_ADMINS, GROUPS.ADMIN],
  })
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Expose({ groups: [GROUPS.USER, GROUPS.ADMIN] })
  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Expose({ groups: [GROUPS.USER, GROUPS.ADMIN] })
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  // Add any other common fields for both User and Admin here
}
