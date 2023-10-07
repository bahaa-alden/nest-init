import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  @ApiProperty({ required: false })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsUnique(Entities.Admin, { message: 'email already used' })
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;
}
