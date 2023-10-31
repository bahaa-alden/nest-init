import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BasePerson } from '../../../common';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common';
import { Role } from '../../roles';
import { AdminImage } from './admin-image.entity';

@Entity({ name: 'admins' })
export class Admin extends BasePerson {
  @Expose({ groups: [GROUPS.ADMIN] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.admins)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @Exclude()
  @OneToMany(() => AdminImage, (adminImage) => adminImage.admin, {
    cascade: true,
  })
  images: AdminImage[];

  @Expose()
  photo() {
    return this.images[this.images.length - 1];
  }
}
