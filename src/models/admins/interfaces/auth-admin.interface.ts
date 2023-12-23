import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../entities/admin.entity';

export abstract class AdminAuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty({ type: Admin })
  admin: Admin;
}
