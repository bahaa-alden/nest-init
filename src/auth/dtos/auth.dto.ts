import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  length,
} from 'class-validator';

export class SignUpDto {
  @IsOptional()
  @IsString()
  @Length(3, 16)
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @Length(3, 16)
  readonly lastName: string;

  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;
}

export class AuthDto {
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @IsString()
  @Length(6, 16)
  readonly password: string;
}
