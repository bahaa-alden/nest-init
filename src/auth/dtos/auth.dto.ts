import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @Length(3, 16)
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 16)
  readonly password: string;
}

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 16)
  readonly password: string;
}
