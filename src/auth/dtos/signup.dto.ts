import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsUnique } from '../../common/decorators';
import { Entities } from '../../common/enums';
import { LoginDto } from './login.dto';

export abstract class SignUpDto extends LoginDto {
  @ApiProperty({ default: 'bahaa' })
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @IsUnique(Entities.User, { message: 'Email already taken' })
  readonly email: string;
}
