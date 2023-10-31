import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseImage } from '../../../common';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_images' })
export class UserImage extends BaseImage {
  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @Column()
  userId: string;
}
