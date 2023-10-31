import { IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common';
import { Entities } from '../../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsUnique(Entities.Category)
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(15)
  description: string;
}
