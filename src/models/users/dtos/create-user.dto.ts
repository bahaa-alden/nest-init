import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common';
import { Entities } from '../../../common';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.User)
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;

  // @IsEnum(Role)
  // role: Role;
}
