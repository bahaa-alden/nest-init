import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { GROUPS } from '../enums';
import * as argon from 'argon2';
import { GlobalEntity } from './global-entity.entity';

@Entity()
export class BasePerson extends GlobalEntity {
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
  @ApiProperty({ uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Exclude()
  @Column({ nullable: true, select: false })
  passwordChangedAt: Date;

  @Exclude()
  @Column({ nullable: true, unique: true, select: false })
  passwordResetToken: string;

  @Exclude()
  @Column({ nullable: true, select: false })
  passwordResetExpires: Date;

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
