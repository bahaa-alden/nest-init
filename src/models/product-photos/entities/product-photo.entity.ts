import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasePhoto } from '../../../common/entities';
import { Product } from '../../products/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'product_photos' })
export class ProductPhoto extends BasePhoto {
  @Exclude()
  @ManyToOne(() => Product, (product) => product.photos)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;

  @Exclude()
  @Column('uuid')
  productId: string;
}
