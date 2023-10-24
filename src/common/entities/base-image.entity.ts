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
import { GlobalEntity } from './global-entity.entity';

@Entity()
export class BaseImage extends GlobalEntity {
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
}
