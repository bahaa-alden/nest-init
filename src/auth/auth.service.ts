import { PrismaService } from './../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, SignUpDto } from './dtos';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignUpDto) {
    const input = { ...dto };
    input.password = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: input,
      });
      user.password = undefined;
      const data = {
        token: await this.signToken(user.id, user.email),
        user,
      };
      return data;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnauthorizedException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await argon.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    user.password = undefined;
    const data = {
      token: await this.signToken(user.id, user.email),
      user,
    };
    return data;
  }

  signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    return this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
  }
}
