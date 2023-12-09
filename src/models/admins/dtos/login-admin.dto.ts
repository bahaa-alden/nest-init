import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';
import { AdminPhoto } from '../entities/admin-image.entity';
import { Admin } from '../entities/admin.entity';

export class LoginAdminDto {
  @ApiProperty({ default: 'super@dev.io' })
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

  @ApiProperty({ type: Admin })
  admin: Admin;

  @ApiProperty({ type: AdminPhoto })
  photo: AdminPhoto;
}
