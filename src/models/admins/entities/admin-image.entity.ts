import { Entity, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';
import { BaseImage } from '../../../common/entities';

@Entity({ name: 'admin_images' })
export class AdminImage extends BaseImage {
  @ManyToOne(() => Admin, (admin) => admin.images)
  admin: Admin;
}
