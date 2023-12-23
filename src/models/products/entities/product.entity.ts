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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product extends GlobalEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty({ minimum: 1 })
  @Column()
  price: number;

  @ApiProperty({ default: false })
  @Column({ default: false })
  is_paid: boolean;

  @ApiProperty({ type: User })
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: Relation<User>;

  // @ApiProperty()
  @Exclude()
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => Coupon, (coupon) => coupon.product, { cascade: true })
  coupons: Coupon[];

  @ApiProperty({ type: ProductPhoto, isArray: false })
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

  @ApiProperty({ type: Category })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Relation<Category>;

  // @ApiProperty()
  @Column({ type: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: Store })
  @ManyToOne((type) => Store, (store) => store.products)
  @JoinColumn({ name: 'storeId', referencedColumnName: 'id' })
  store: Relation<Store>;

  @Exclude()
  @Column({ type: 'uuid' })
  storeId: string;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  _comments: Comment[];

  @ApiProperty({ default: 0 })
  @Expose({ groups: [GROUPS.ALL_PRODUCTS, GROUPS.PRODUCT] })
  likes() {
    if (this.likedBy) return this.likedBy.length;
    return 0;
  }

  @ApiProperty({ default: 0 })
  @Expose({ groups: [GROUPS.ALL_PRODUCTS, GROUPS.PRODUCT] })
  comments() {
    if (this.comments) return this.comments.length;
    return 0;
  }
}
