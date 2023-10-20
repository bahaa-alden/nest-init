import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { GROUPS } from '../enums';
import * as argon from 'argon2';
import { EntityBase } from './entity-base.entity';

@Entity()
export class BasePerson extends BaseEntity {
  @Expose({
    groups: [
      GROUPS.ALL_USERS,
      GROUPS.USER,
      GROUPS.ALL_ADMINS,
      GROUPS.ADMIN,
      GROUPS.ALL_EMPLOYEES,
      GROUPS.EMPLOYEE,
    ],
  })
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({
    groups: [
      GROUPS.ALL_USERS,
      GROUPS.USER,
      GROUPS.ALL_ADMINS,
      GROUPS.ADMIN,
      GROUPS.ALL_EMPLOYEES,
      GROUPS.EMPLOYEE,
    ],
  })
  @ApiProperty()
  @Column({})
  name: string;

  @Expose({
    groups: [
      GROUPS.ALL_USERS,
      GROUPS.USER,
      GROUPS.ALL_ADMINS,
      GROUPS.ADMIN,
      GROUPS.ALL_EMPLOYEES,
      GROUPS.EMPLOYEE,
    ],
  })
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  passwordChangedAt: Date;

  @Exclude()
  @Column({ nullable: true })
  passwordResetToken: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Expose({
    groups: [GROUPS.USER, GROUPS.ADMIN, GROUPS.EMPLOYEE],
  })
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Expose({
    groups: [GROUPS.USER, GROUPS.ADMIN, GROUPS.EMPLOYEE],
  })
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hash() {
    if (this.password) {
      this.password = await this.generateHash(this.password);
    }
  }

  @BeforeUpdate()
  async passChanged() {
    if (this.password) {
      this.passwordChangedAt = new Date(Date.now() - 1000);
    }
  }

  isPasswordChanged(JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      const changeTimestamp: number = this.passwordChangedAt.getTime() / 1000;
      return changeTimestamp > JWTTimestamp;
    }
    return false;
  }

  async generateHash(password: string) {
    return await argon.hash(password);
  }

  async verifyHash(hash: string, password: string) {
    return await argon.verify(hash, password);
  }
  // Add any other common fields for both User and Admin here
}
