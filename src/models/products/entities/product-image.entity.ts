import { Entity, ManyToOne } from 'typeorm';
import { BaseImage } from '../../../common';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage extends BaseImage {
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
