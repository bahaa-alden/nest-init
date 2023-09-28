import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dtos';
import { User } from '../models/users/entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos';
import { verifyHash } from '../common/helpers';
import { jwtPayload } from './interfaces';
import { Role } from '../models/roles/entities/role.entity';
import { Entities, ROLE } from '../common/enums';
import { JwtTokenService } from '../shared/jwt/jwt-token.service';
import { Admin } from '../models/admins/entities/admin.entity';

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
  ) {}
  async signup(dto: SignUpDto) {
    const role = await this.rolesRepository.findOneBy({ name: ROLE.USER });
    const user = this.usersRepository.create({ ...dto, role });
    await this.usersRepository.insert(user);
    const token = await this.jwtTokenService.signToken(
      user.id,
      user.email,
      ROLE.USER,
    );
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
      relations: { role: true },
    });

    if (!user || !(await verifyHash(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(
      user.id,
      user.email,
      ROLE.USER,
    );
    return { token, user };
  }

  async validate(payload: jwtPayload) {
    let user;
    if (payload.role === ROLE.ADMIN) {
      user = await this.adminsRepository.findOne({
        where: { email: payload.email, id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
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
        },
        relations: { role: { permissions: true } },
      });
    } else if (payload.role === ROLE.USER) {
      user = await this.usersRepository.findOne({
        where: { email: payload.email, id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
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
        },
        relations: { role: { permissions: true } },
      });
    }

    if (!user) {
      throw new UnauthorizedException('The user is not here');
    }

    return user;
  }
}
