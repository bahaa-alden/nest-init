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

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.coupons)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.coupons)
  @JoinColumn()
  product: Product;

  @Column({ default: null, nullable: true })
  expire: Date;

  @Column()
  discount: number;

  @Column({ default: true })
  active: boolean;
}
