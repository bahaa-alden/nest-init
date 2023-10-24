import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  Repository,
} from 'typeorm';
import { ROLE } from '../common';
import { Role } from '../models/roles';
import { User, UserImage } from '../models/users';
import { JwtTokenService } from '../shared/jwt';
import { SignUpDto, LoginDto, PasswordChangeDto } from './dtos';
import { jwtPayload } from './interfaces';
import { Admin } from '../models/admins';
import { defaultImage } from '../common';

@Injectable()
export class AuthService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(UserImage)
    private userImageRepository: Repository<UserImage>,
  ) {}
  async signup(dto: SignUpDto) {
    const role = await this.rolesRepository.findOneBy({ name: ROLE.USER });
    const user = this.usersRepository.create({ ...dto, role, images: [] });
    user.images.push(this.userImageRepository.create(defaultImage));
    await this.usersRepository.save(user);
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);
    return {
      token,
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { role: true, images: true },
    });

    if (!user || !(await user.verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(user.id, ROLE.USER);
    return { token, user };
  }

  async updateMyPassword(dto: PasswordChangeDto, id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { role: true, images: true },
    });

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
      images: false,
    };
    const relations: FindOptionsRelations<User> = {
      role: { permissions: true },
      images: true,
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
