import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { IsUnique } from '../../../common';
import { Entities } from '../../../common';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  @ApiProperty({ required: false })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.User, { message: 'Email already taken' })
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly photo?: string;
}
