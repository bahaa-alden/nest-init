import { Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseImage } from '../../../common/entities';

@Entity({ name: 'user_images' })
export class UserImage extends BaseImage {
  @ManyToOne(() => User, (user) => user.images)
  user: User;
}
