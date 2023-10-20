import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseImage {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Exclude()
  @Column()
  publicId: string;

  @ApiProperty()
  @Column()
  blurHash: string;

  @ApiProperty()
  @Column()
  profileUrl: string;

  @ApiProperty()
  @Column()
  mobileUrl: string;

  @ApiProperty()
  @Column()
  webUrl: string;

  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
