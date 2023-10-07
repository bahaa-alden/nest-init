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

  @ApiProperty()
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

  @ApiProperty()
  @CreateDateColumn()
  createdAt?: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
