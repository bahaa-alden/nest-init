import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { IsUnique } from '../../../common';
import { Entities } from '../../../common';
import { Transform } from 'class-transformer';

export class UpdateEmployeeDto {
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
  @IsUnique(Entities.Employee)
  readonly email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(6, 15)
  readonly password: string;
}
