import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Admin } from './admin.entity';
import { BaseImage } from '../../../common';
import { Exclude } from 'class-transformer';

@Entity({ name: 'admin_images' })
export class AdminImage extends BaseImage {
  @ManyToOne(() => Admin, (admin) => admin.images)
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @Exclude()
  @Column()
  adminId: string;
}
