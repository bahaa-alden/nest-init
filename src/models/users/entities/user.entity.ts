import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BasePerson, BasePhoto } from '../../../common/entities';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums';
import { Role } from '../../roles';
import { UserPhoto } from './user-photo.entity';
import * as crypto from 'crypto';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Product } from '../../products';
import { Category } from '../../categories';
import { City } from '../../cities';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from './wallet.entity';

@Entity({ name: 'users' })
export class User extends BasePerson {
  @Exclude()
  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Exclude()
  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Expose({ groups: [GROUPS.USER] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @ApiProperty({ type: Wallet })
  @Expose({ groups: [GROUPS.USER] })
  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  wallet: Wallet;

  @Exclude()
  @OneToMany(() => UserPhoto, (userPhoto) => userPhoto.user, {
    cascade: true,
    eager: true,
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
  @ManyToMany(() => Product, (product) => product.likedBy)
  likedProducts: Product[];

  @ApiProperty({
    type: Category,
    isArray: true,
  })
  @Expose({ groups: [GROUPS.USER] })
  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable({
    name: 'users_categories',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  favoriteCategories: Category[];

  @ApiProperty({ type: City, isArray: true })
  @Expose({ groups: [GROUPS.USER] })
  @ManyToMany(() => City, (city) => city.users)
  @JoinTable({
    name: 'users_cities',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cityId', referencedColumnName: 'id' },
  })
  favoriteCities: City[];

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
  })
  comments: Comment[];

  @Expose({})
  @ApiProperty({ type: BasePhoto })
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
