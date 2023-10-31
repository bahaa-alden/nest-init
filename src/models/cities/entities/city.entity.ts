import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import { Store } from '../../stores';
import { Exclude } from 'class-transformer';
import { GlobalEntity } from '../../../common';

@Entity({ name: 'cities' })
export class City extends GlobalEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Store, (store) => store.city, { cascade: true })
  stores: Store[];
}
