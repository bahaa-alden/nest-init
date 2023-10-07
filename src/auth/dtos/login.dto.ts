import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';
import { User } from '../../models/users';

export class LoginDto {
  @ApiProperty({ default: 'ibo@dev.io' })
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @ApiProperty({ default: 'test1234' })
  @IsString()
  @Length(6, 16)
  readonly password: string;
}
export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: User })
  user: User;
}
