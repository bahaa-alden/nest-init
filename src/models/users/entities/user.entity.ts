import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BasePerson } from '../../../common';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common';
import { Role } from '../../roles';
import { UserImage } from './user-image.entity';
import * as crypto from 'crypto';

@Entity({ name: 'users' })
export class User extends BasePerson {
  @Expose({ groups: [GROUPS.USER] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @Exclude()
  @OneToMany(() => UserImage, (userImage) => userImage.user, {
    cascade: true,
  })
  images: UserImage[];

  @Expose({ groups: [GROUPS.USER, GROUPS.ALL_USERS] })
  photo() {
    if (this.images) return this.images[this.images.length - 1];
    return undefined;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }
}
