import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
// import { IsEmailUnique } from '../../../common/decorators/validations/is-email-unique.validation';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  // @IsEmailUnique({ message: 'Email already taken' })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;

  // @IsEnum(Role)
  // role: Role;
}
