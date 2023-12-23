import { Product } from './../../products';
import { User } from '../../users';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Relation,
} from 'typeorm';
import { GlobalEntity } from '../../../common/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Unique('un_coupon', ['userId', 'productId'])
@Entity('coupons')
export class Coupon extends GlobalEntity {
  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.myCoupons, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Exclude()
  @Column({ type: 'uuid' })
  userId: string;

  @Exclude()
  @ManyToOne(() => User, (proOwner) => proOwner.ownedCoupons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proOwnerId' })
  proOwner: Relation<User>;

  @Exclude()
  @Column({ type: 'uuid' })
  proOwnerId: string;

  @ApiProperty({ type: Product })
  @ManyToOne(() => Product, (product) => product.coupons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @Exclude()
  @Column({ type: 'uuid' })
  productId: string;

  @ApiProperty()
  @Column({ default: null, nullable: true, type: 'date' })
  expire: Date;

  @ApiProperty()
  @Column()
  discount: number;

  @Column({ default: true })
  active: boolean;
}
