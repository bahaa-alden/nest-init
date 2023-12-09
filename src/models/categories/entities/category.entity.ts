import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common/entities';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users';

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

  @ManyToMany(() => User, (user) => user.favoriteCategories, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];
}
