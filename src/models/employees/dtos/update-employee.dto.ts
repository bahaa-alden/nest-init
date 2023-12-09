import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { IsPhotoExist, IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { getPhotoPath } from '../../../common/helpers';

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
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => getPhotoPath(value))
  @IsPhotoExist()
  readonly photo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(6, 15)
  readonly password: string;
}
