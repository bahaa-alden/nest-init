import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { UUID } from 'crypto';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  @ApiProperty()
  permissions: string[];
}
