import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BasePhoto } from '../../../common/entities';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'product_photos' })
export class ProductPhoto extends BasePhoto {
  @ManyToOne(() => Product, (product) => product.photos)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;

  @Column('uuid')
  productId: string;
}
