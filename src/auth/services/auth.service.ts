import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  MoreThan,
} from 'typeorm';
import { Entities, ROLE } from '../../common/enums';
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
import { AdminRepository } from '../../shared/repositories/admin';
import { UserRepository } from '../../shared/repositories/user';
import { RoleRepository } from '../../shared/repositories/role/role.repository';
import { MailService } from '../../mail/mail.service';
import { IAuthController } from '../../common/interfaces';
import * as crypto from 'crypto';
import {
  item_not_found,
  incorrect_current_password,
  incorrect_credentials,
  reset_token_message,
  reset_token_expired,
  password_changed_recently,
} from '../../common/constants';
import { Employee } from '../../models/employees';
import { EmployeeRepository } from '../../shared/repositories/employee/employee.repository';

@Injectable()
export class AuthService implements IAuthController<AuthUserResponse> {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersRepository: UserRepository,
    private readonly adminsRepository: AdminRepository,
    private employeeRepository: EmployeeRepository,
    private readonly roleRepository: RoleRepository,
    private readonly mailService: MailService,
  ) {}
  async signup(
    dto: SignUpDto,
    dynamicOrigin: string,
  ): Promise<AuthUserResponse> {
    const role = await this.roleRepository.findOneBy({ name: ROLE.USER });
    const user = await this.usersRepository.createOne(dto, role);
    await this.mailService.sendWelcomeEmail(user, dynamicOrigin);
    return this.sendAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthUserResponse> {
    const user = await this.usersRepository.findByIdOrEmail(dto.email);
    if (!user || !(await user.verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException(incorrect_credentials);
    }
    return this.sendAuthResponse(user);
  }

  async updateMyPassword(dto: PasswordChangeDto, email: string) {
    const user = await this.usersRepository.findByIdOrEmail(email);

    if (!user) throw new NotFoundException(item_not_found(Entities.User));

    // 2)check if the passwordConfirm is correct
    if (!(await user.verifyHash(user.password, dto.passwordCurrent))) {
      throw new UnauthorizedException(incorrect_current_password);
    }
    await this.usersRepository.resetPassword(user, dto);
    const token = await this.jwtTokenService.signToken(user.id, User.name);

    return { token, user };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findByIdOrEmail(dto.email);
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
    let user = await this.usersRepository.findOneBy({
      passwordResetToken: hashToken,
      passwordResetExpires: MoreThan(new Date()),
    });
    if (!user) {
      throw new NotFoundException(reset_token_expired);
    }
    user = await this.usersRepository.resetPassword(user, dto);
    await this.mailService.sendPasswordChanged(user, dynamicOrigin);
    return this.sendAuthResponse(user);
  }

  async sendAuthResponse(user: User): Promise<AuthUserResponse> {
    const token = await this.jwtTokenService.signToken(user.id, User.name);
    return { token, user };
  }

  async validate(payload: jwtPayload) {
    let user: User | Admin | Employee;

    if (payload.entity === Admin.name) {
      user = await this.adminsRepository.validate(payload.sub);
    } else if (payload.entity === User.name) {
      user = await this.usersRepository.validate(payload.sub);
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
