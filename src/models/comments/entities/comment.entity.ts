import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GlobalEntity } from '../../../common/entities';
import { User } from '../../users';
import { Product } from '../../products';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { GROUPS } from '../../../common/enums';

@Entity('comments')
export class Comment extends GlobalEntity {
  @Expose({ groups: [GROUPS.ALL_COMMENTS, GROUPS.COMMENT] })
  @ApiProperty()
  @Column({ type: 'varchar' })
  content: string;

  @Expose({ groups: [GROUPS.ALL_COMMENTS, GROUPS.COMMENT] })
  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @ApiProperty()
  @Column({ type: 'uuid' })
  userId: string;

  @Exclude()
  @ManyToOne(() => Product, (product) => product.comments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // @Exclude()
  // @ApiProperty()
  @Column({ type: 'uuid' })
  productId: string;
}
