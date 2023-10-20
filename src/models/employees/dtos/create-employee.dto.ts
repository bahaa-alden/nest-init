import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
// import { IsEmailUnique } from '../../../common/decorators/validations';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @IsUnique(Entities.Employee)
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsUUID()
  storeId: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  readonly photo?: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;
}
