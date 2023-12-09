import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsPhotoExist, IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { getPhotoPath } from '../../../common/helpers';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.Employee)
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsUUID()
  storeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => getPhotoPath(value))
  @IsPhotoExist()
  readonly photo?: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;
}
