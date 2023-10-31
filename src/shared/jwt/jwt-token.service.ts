import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtConfig } from '../../config/app';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwt: JwtService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}
  signToken = (id: string, role: string): Promise<string> => {
    const payload = { sub: id, role };
    const token = this.jwt.signAsync(payload, {
      secret: this.jwtConfig.jwtSecret,
      expiresIn: this.jwtConfig.jwtExpiresIn,
    });
    return token;
  };
}
