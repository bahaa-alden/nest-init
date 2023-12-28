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
import { AdminRepository } from '../../shared/repositories/admin';
import { UserRepository } from '../../shared/repositories/user';
import { RoleRepository } from '../../shared/repositories/role/role.repository';
import { MailService } from '../../mail/mail.service';
import { IAuthController } from '../../common/interfaces';
import * as crypto from 'crypto';

@Injectable()
export class AuthService implements IAuthController<AuthUserResponse> {
  constructor(
    private jwtTokenService: JwtTokenService,
    private usersRepository: UserRepository,
    private adminsRepository: AdminRepository,
    private roleRepository: RoleRepository,
    private mailService: MailService,
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
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user || !(await user.verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    return this.sendAuthResponse(user);
  }

  async updateMyPassword(dto: PasswordChangeDto, email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    // 2)check if the passwordConfirm is correct
    if (!(await user.verifyHash(user.password, dto.passwordCurrent))) {
      throw new UnauthorizedException('كلمة المرور الحالية غير صحيحة');
    }

    user.password = dto.password;
    await this.usersRepository.save(user);
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);

    return { token, user };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    const resetToken = user.createPasswordResetToken();
    await user.save();
    await this.mailService.sendPasswordReset(user, resetToken);
    return { message: 'تم ارسال رمز اعادة التعيين لبريدك الالكتروني' };
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
      throw new NotFoundException('الرمز غير صحيح او منتهي الصلاحية');
    }
    user = await this.usersRepository.resetPassword(user, dto);
    await this.mailService.sendPasswordChanged(user, dynamicOrigin);
    return this.sendAuthResponse(user);
  }

  async sendAuthResponse(user: User): Promise<AuthUserResponse> {
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);
    return { token, user };
  }

  async validate(payload: jwtPayload) {
    let user: User | Admin;
    const where: FindOptionsWhere<User> = { id: payload.sub };
    const select: FindOptionsSelect<User> = {
      id: true,
      name: true,
      email: true,
      passwordChangedAt: true,
      role: {
        id: true,
        name: true,
        permissions: {
          id: true,
          action: true,
          subject: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      photos: false,
    };
    const relations: FindOptionsRelations<User> = {
      role: { permissions: true },
      photos: true,
    };
    if (payload.role === ROLE.ADMIN) {
      user = await this.adminsRepository.findOne({
        where,
        select,
        relations,
      });
    } else if (payload.role === ROLE.USER) {
      user = await this.usersRepository.findOne({ where, select, relations });
    }

    if (!user) {
      throw new UnauthorizedException('The user is not here');
    }

    if (user.isPasswordChanged(payload.iat)) {
      throw new UnauthorizedException(
        'User recently changed the password!, please login again.',
      );
    }
    return user;
  }
}
