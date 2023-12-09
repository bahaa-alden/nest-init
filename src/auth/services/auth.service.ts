import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { ROLE } from '../../common/enums';
import { User } from '../../models/users';
import { JwtTokenService } from '../../shared/jwt';
import { SignUpDto, PasswordChangeDto, LoginUserDto } from '../dtos';
import { jwtPayload } from '../interfaces';
import { Admin } from './../../models/admins';
import { AdminRepository } from '../../shared/repositories/admin';
import { UserRepository } from '../../shared/repositories/user';
import { RoleRepository } from '../../shared/repositories/role/role.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private usersRepository: UserRepository,
    private adminsRepository: AdminRepository,
    private roleRepository: RoleRepository,
  ) {}
  async signup(dto: SignUpDto) {
    const role = await this.roleRepository.findByName(ROLE.USER);
    const user = await this.usersRepository.createOne(dto, role);
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);
    return {
      token,
      user,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user || !(await user.verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);
    return { token, user };
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
