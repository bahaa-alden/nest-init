import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends GlobalEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @Column()
  description: string;
}
