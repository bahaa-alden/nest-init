import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @Length(3, 16)
  readonly lastName?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  readonly email?: string;
}
