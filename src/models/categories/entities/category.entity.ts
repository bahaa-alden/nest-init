import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'categories' })
export class Category extends GlobalEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];
}
