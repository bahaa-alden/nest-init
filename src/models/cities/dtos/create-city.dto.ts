import { IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty()
  @Length(3)
  @IsString()
  @IsUnique(Entities.City)
  name: string;
}
