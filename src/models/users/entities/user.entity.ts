import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BasePerson } from '../../../common/entities';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums';
import { Role } from '../../roles';
import { UserPhoto } from './user-image.entity';
import * as crypto from 'crypto';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Product } from '../../products';
import { Category } from '../../categories';
import { City } from '../../cities';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends BasePerson {
  @Expose({ groups: [GROUPS.USER, GROUPS.PRODUCT] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @Exclude()
  @OneToMany(() => UserPhoto, (userPhoto) => userPhoto.user, {
    cascade: true,
  })
  photos: UserPhoto[];

  @Exclude()
  @OneToMany(() => Coupon, (coupon) => coupon.user, { cascade: true })
  myCoupons: Coupon[];

  @Exclude()
  @OneToMany(() => Coupon, (coupon) => coupon.proOwner, { cascade: true })
  ownedCoupons: Coupon[];

  @Exclude()
  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];

  @Exclude()
  @ManyToOne(() => Product, (product) => product.likedBy)
  likedProducts: Product[];

  @ManyToMany(() => Category, (category) => category.users)
  favoriteCategories: Category[];

  @ManyToMany(() => City, (city) => city.users)
  favoriteCities: City[];

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];

  @Expose({
    groups: [
      GROUPS.USER,
      GROUPS.ALL_USERS,
      GROUPS.ALL_PRODUCTS,
      GROUPS.PRODUCT,
    ],
  })
  photo() {
    if (this.photos) return this.photos[this.photos.length - 1];
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
