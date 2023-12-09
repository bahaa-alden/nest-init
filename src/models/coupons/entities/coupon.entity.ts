import { Product } from './../../products';
import { User } from '../../users';
// src/coupons/coupon.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GlobalEntity } from '../../../common/entities';

@Entity('coupons')
export class Coupon extends GlobalEntity {
  @ManyToOne(() => User, (user) => user.myCoupons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (proOwner) => proOwner.ownedCoupons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proOwnerId' })
  proOwner: User;

  @Column({ type: 'uuid' })
  proOwnerId: string;

  @ManyToOne(() => Product, (product) => product.coupons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ default: null, nullable: true })
  expire: Date;

  @Column()
  discount: number;

  @Column({ default: true })
  active: boolean;
}
