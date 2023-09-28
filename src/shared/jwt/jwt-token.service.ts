import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(private jwt: JwtService, private config: ConfigService) {}
  signToken = (id: string, email: string, role: string): Promise<string> => {
    const payload = { sub: id, email, role };
    const token = this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    return token;
  };
}
