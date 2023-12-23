import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from '../../../auth';

export class LoginAdminDto extends LoginDto {
  @ApiProperty({ default: 'super@dev.io' })
  readonly email: string;
}
