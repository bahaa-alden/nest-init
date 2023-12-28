import { IsEmail, IsString } from 'class-validator';
import { IsExist } from '../../common/decorators';
import { Entities } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ default: 'ibo@dev.io' })
  @IsString()
  @IsEmail()
  @IsExist(Entities.User, { message: 'User not found' })
  readonly email: string;
}
