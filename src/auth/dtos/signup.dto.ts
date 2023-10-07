import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsEmail } from 'class-validator';
import { IsUnique } from '../../common/decorators';
import { Entities } from '../../common/enums';

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
