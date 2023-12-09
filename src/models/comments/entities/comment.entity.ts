import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GlobalEntity } from '../../../common/entities';
import { User } from '../../users';
import { Product } from '../../products';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comments')
export class Comment extends GlobalEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Product, (product) => product.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // @ApiProperty()
  @Column({ type: 'uuid' })
  productId: string;
}
