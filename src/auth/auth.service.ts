import { UserModel } from '../users/interface/users.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, SignUpDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignUpDto) {
    const user = await this.userModel.create(dto);
    user.password = undefined;
    const token = await this.signToken(user.id, user.email);
    const data = {
      token,
      user,
    };
    return data;
  }

  async login(dto: AuthDto) {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');
    if (!user || !(await user.comparePassword(user.password, dto.password))) {
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

  signToken(userId: string, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const token = this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    return token;
  }
}
