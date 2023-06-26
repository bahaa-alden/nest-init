import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, SignUpDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async signup(dto: SignUpDto) {
    try {
      const input: any = dto;
      input.password = await argon.hash(dto.password);
      const user = await this.usersRepository.save(input);
      user.password = undefined;
      const token = await this.signToken(user.id, user.email);
      const data = {
        token,
        user,
      };
      return data;
    } catch (error) {
      if (error.code === '23505') {
        // Assuming the error code '23505' corresponds to a duplicated key violation
        throw new ConflictException('Email is already taken.');
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      select: { password: true, email: true, name: true },
    });
    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    user.password = undefined;
    const token = await this.signToken(user.id, user.email);

    const data = {
      token,
      user,
    };
    return data;
  }

  async validate(payload: jwtPayload) {
    const user = this.usersRepository.findOne({
      where: { email: payload.email, id: +payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException({
        message: 'The user belonging to this token does no longer exist',
      });
    }
    return user;
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const token = this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    return token;
  }
}
