import { Admin } from '../../../models/admins';
import { Employee } from '../../../models/employees';
import { User } from '../../../models/users';
import {
  SignUpDto,
  LoginDto,
  PasswordChangeDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../../dtos';
import { AuthUserResponse } from '../auth-user.interface';
import { jwtPayload } from '../jwt-payload.interface';

export interface IAuthService {
  signup(dto: SignUpDto, dynamicOrigin: string): Promise<AuthUserResponse>;

  login(dto: LoginDto): Promise<AuthUserResponse | { token: string }>;

  updateMyPassword(
    dto: PasswordChangeDto,
    user: User,
  ): Promise<AuthUserResponse>;

  forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }>;
  resetPassword(
    dto: ResetPasswordDto,
    dynamicOrigin: string,
  ): Promise<AuthUserResponse>;

  sendAuthResponse(
    user: User,
    isTwoFactorAuth?: boolean,
  ): Promise<AuthUserResponse>;

  validate(payload: jwtPayload): Promise<User | Admin | Employee>;
}
