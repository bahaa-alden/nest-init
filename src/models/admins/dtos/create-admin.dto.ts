import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
// import { IsEmailUnique } from '../../../common/decorators/validations';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @IsUnique(Entities.Admin, { message: 'admin already exist' })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(6, 15)
  readonly password: string;
}
