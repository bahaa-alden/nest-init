import { Product } from './../../products';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from '../../cities';
import { Exclude, Transform } from 'class-transformer';
import { Employee } from '../../employees/entities/employee.entity';
import { GlobalEntity } from '../../../common/entities';

@Entity({ name: 'stores' })
export class Store extends GlobalEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Transform(({ value }) => {
    return { name: value.name };
  })
  @ManyToOne(() => City, (city) => city.stores, { eager: true })
  @JoinColumn({ name: 'cityId', referencedColumnName: 'id' })
  city: City;

  @Exclude()
  @Column()
  cityId: string;

  @OneToMany(() => Product, (product) => product.store, { cascade: true })
  products: Product[];

  @OneToMany(() => Employee, (employee) => employee.store, { cascade: true })
  employees: Employee[];
}
