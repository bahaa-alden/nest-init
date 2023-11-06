import { Coupon } from './../../coupons';
import { Category } from './../../categories';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { GROUPS, GlobalEntity } from '../../../common';
import { Store } from './../../stores';
import { ProductImage } from './product-image.entity';
import { User } from '../../users';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'products' })
export class Product extends GlobalEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  price: number;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ default: 0 })
  comments: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Exclude()
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => Coupon, (coupon) => coupon.product, { cascade: true })
  coupons: Coupon[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  @Exclude()
  @ManyToMany(() => User, (user) => user.likedProducts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  likedBy: User[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Store, (store) => store.products)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: Store;

  @Exclude()
  @Column({ type: 'uuid' })
  storeId: string;

  @Expose({})
  likes() {
    return this.likedBy !== null ? this.likedBy.length : 0;
  }
}
