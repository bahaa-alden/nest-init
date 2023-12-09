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
  Relation,
} from 'typeorm';
import { GROUPS } from '../../../common/enums';
import { Store } from './../../stores';
import { ProductPhoto } from '../../product-photos/entities/product-photo.entity';
import { User } from '../../users';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from '../../comments/entities/comment.entity';
import { GlobalEntity } from '../../../common/entities';

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
  commentsNum: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Relation<User>;

  @Exclude()
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => Coupon, (coupon) => coupon.product, { cascade: true })
  coupons: Coupon[];

  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product, {
    cascade: true,
  })
  photos: ProductPhoto[];

  @Exclude()
  @ManyToMany(() => User, (user) => user.likedProducts, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
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

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];

  @Expose({})
  likes() {
    if (this.likedBy) return this.likedBy.length;
    return 0;
  }
}
