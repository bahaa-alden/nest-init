import { IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common';
import { Entities } from '../../../common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty()
  @Length(3)
  @IsString()
  @IsUnique(Entities.City)
  name: string;
}
