import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ROLE } from '../../common/enums';
import { User } from '../../models/users';
import { JwtTokenService } from '../../shared/jwt';
import {
  SignUpDto,
  PasswordChangeDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos';
import { AuthUserResponse, jwtPayload } from '../interfaces';
import { Admin } from './../../models/admins';

import * as crypto from 'crypto';
import {
  incorrect_current_password,
  incorrect_credentials,
  reset_token_message,
  reset_token_expired,
  password_changed_recently,
} from '../../common/constants';
import { Employee } from '../../models/employees';
import { MailService } from '../../shared/mail/mail.service';
import { IAdminRepository } from '../../models/admins/interfaces/repositories/admin.repository.interface';
import { ADMIN_TYPES } from '../../models/admins/interfaces/type';
import { IEmployeeRepository } from '../../models/employees/interfaces/repositories/employee.repository.interface';
import { EMPLOYEE_TYPES } from '../../models/employees/interfaces/type';
import { USER_TYPES } from '../../models/users/interfaces/type';
import { IUserRepository } from '../../models/users/interfaces/repositories/user.repository.interface';
import { ROLE_TYPES } from '../../models/roles/interfaces/type';
import { IRoleRepository } from '../../models/roles/interfaces/repositories/role.repository.interface';
import { IAuthService } from '../interfaces/services/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(USER_TYPES.repository.user)
    private readonly userRepository: IUserRepository,
    @Inject(ADMIN_TYPES.repository.admin)
    private readonly adminRepository: IAdminRepository,
    @Inject(EMPLOYEE_TYPES.repository.employee)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(ROLE_TYPES.repository)
    private readonly roleRepository: IRoleRepository,
    private readonly mailService: MailService,
  ) {}
  async signup(
    dto: SignUpDto,
    dynamicOrigin: string,
  ): Promise<AuthUserResponse> {
    const role = await this.roleRepository.findByName(ROLE.USER);
    const user = await this.userRepository.create(dto, role);
    await this.mailService.sendWelcomeEmail(user, dynamicOrigin);
    return this.sendAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthUserResponse | { token: string }> {
    const user = await this.userRepository.findOneByEmail(dto.email);
    if (!user || !(await user.verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException(incorrect_credentials);
    }

    const res = await this.sendAuthResponse(user);
    if (user.isTwoFactorAuthenticationEnabled) return { token: res.token };
    return res;
  }

  async updateMyPassword(
    dto: PasswordChangeDto,
    user: User,
  ): Promise<AuthUserResponse> {
    // 2)check if the passwordConfirm is correct
    if (!(await user.verifyHash(user.password, dto.passwordCurrent))) {
      throw new UnauthorizedException(incorrect_current_password);
    }
    user = await this.userRepository.resetPassword(user, dto);
    return this.sendAuthResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOneByEmail(dto.email);
    const resetToken = user.createPasswordResetToken();
    await user.save();
    await this.mailService.sendPasswordReset(user, resetToken);
    return { message: reset_token_message };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    dynamicOrigin: string,
  ): Promise<AuthUserResponse> {
    const hashToken = crypto
      .createHash('sha256')
      .update(dto.resetToken)
      .digest('hex');
    let user = await this.userRepository.findOneByResetToken(hashToken);
    if (!user) {
      throw new NotFoundException(reset_token_expired);
    }
    user = await this.userRepository.resetPassword(user, dto);
    await this.mailService.sendPasswordChanged(user, dynamicOrigin);
    return this.sendAuthResponse(user);
  }

  async sendAuthResponse(
    user: User,
    isTwoFactorAuth = false,
  ): Promise<AuthUserResponse> {
    let token: string;
    if (!isTwoFactorAuth)
      token = await this.jwtTokenService.signToken(user.id, User.name);
    else
      token = await this.jwtTokenService.getCookieWithJwtAccessToken(
        user.id,
        isTwoFactorAuth,
      );

    return { token, user };
  }

  async validate(payload: jwtPayload): Promise<User | Admin | Employee> {
    let user: User | Admin | Employee;

    if (payload.entity === Admin.name) {
      user = await this.adminRepository.validate(payload.sub);
    } else if (payload.entity === User.name) {
      user = await this.userRepository.validate(payload.sub);
    } else {
      user = await this.employeeRepository.validate(payload.sub);
    }

    if (!user) {
      throw new UnauthorizedException('The user is not here');
    }

    if (user.isPasswordChanged(payload.iat)) {
      throw new UnauthorizedException(password_changed_recently);
    }
    return user;
  }
}
