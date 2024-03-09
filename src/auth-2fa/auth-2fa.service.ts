import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUsersService } from '../models/users/interfaces/services/users.service.interface';
import { ConfigService } from '@nestjs/config';
import { USER_TYPES } from '../models/users/interfaces/type';
import { User } from '../models/users';
import { toDataURL } from 'qrcode';
import * as crypto from 'crypto';

@Injectable()
export class Auth2faService {
  constructor(
    @Inject(USER_TYPES.service) private readonly usersService: IUsersService,
    private readonly configService: ConfigService,
  ) {}
  async generateTwoFactorAuthenticationSecret(user: User) {
    const otpauthUrl = crypto.randomBytes(32).toString('hex');
    const secret = crypto.createHash('sha256').update(otpauthUrl).digest('hex');

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user);

    return {
      secret,
      otpauthUrl,
    };
  }

  async pipeQrCodeStream(otpauthUrl: string) {
    return toDataURL(otpauthUrl);
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    const secret = crypto
      .createHash('sha256')
      .update(twoFactorAuthenticationCode)
      .digest('hex');
    const isCodeValid = secret === user.twoFactorAuthenticationSecret;
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return;
  }
}
