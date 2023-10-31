import { Entity } from 'typeorm';
import { GlobalEntity } from '../../../common';

@Entity({ name: 'product_images' })
export class ProductImage extends GlobalEntity {}
