import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Store } from '../../stores';
import { Exclude } from 'class-transformer';
import { GlobalEntity } from '../../../common/entities';
import { User } from '../../users';

@Entity({ name: 'cities' })
export class City extends GlobalEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Store, (store) => store.city, { cascade: true })
  stores: Store[];

  @ManyToMany(() => User, (user) => user.favoriteCities, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];
}
