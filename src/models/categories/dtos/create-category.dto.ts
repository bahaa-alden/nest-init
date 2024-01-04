import { IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { item_already_exist } from '../../../common/constants';

export class CreateCategoryDto {
  @ApiProperty()
  @IsUnique(Entities.Category, { message: item_already_exist('category') })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(15)
  description: string;
}
