import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BasePhoto } from '../../../common/entities';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user_photos' })
export class UserPhoto extends BasePhoto {
  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @Column()
  userId: string;
}
