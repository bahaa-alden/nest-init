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

@Entity({ name: 'stores' })
export class Store extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Exclude()
  @Column()
  cityId: string;

  @OneToMany(() => Employee, (employee) => employee.store)
  employees: Employee[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
