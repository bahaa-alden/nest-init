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

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  @ApiProperty({ required: false })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsUnique(Entities.User, { message: 'Email already taken' })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly photo?: string;
}
