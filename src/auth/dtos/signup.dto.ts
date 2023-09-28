import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnique } from '../../common/decorators/validations';
import { Entities } from '../../common/enums';
// import { IsEmailUnique } from '../../common/decorators/validations';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @IsUnique(Entities.User, { message: 'Email already taken' })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 16)
  readonly password: string;
}
