import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Auth2faService } from './auth-2fa.service';
import { JwtGuard } from '../common/guards';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { USER_TYPES } from '../models/users/interfaces/type';
import { IUsersService } from '../models/users/interfaces/services/users.service.interface';
import { GetUser } from '../common/decorators';
import { User } from '../models/users';
import { TwoFactorAuthenticationCodeDto } from './dto/create-auth-2fa.dto';
import { AUTH_TYPES } from '../auth/interfaces/type';
import { IAuthService } from '../auth/interfaces/services/auth.service.interface';

@ApiTags('Auth-2fa')
@ApiBearerAuth('token')
@Controller('auth-2fa')
export class Auth2faController {
  constructor(
    private readonly auth2faService: Auth2faService,
    @Inject(AUTH_TYPES.service) private authService: IAuthService,
    @Inject(USER_TYPES.service)
    private readonly usersService: IUsersService,
  ) {}
  @UseGuards(JwtGuard)
  @Post('generate')
  async register(@Res() response: Response, @GetUser() user: User) {
    const { otpauthUrl } =
      await this.auth2faService.generateTwoFactorAuthenticationSecret(user);
    const QR = await this.auth2faService.pipeQrCodeStream(otpauthUrl);
    response.setHeader('Content-Type', 'image/png');
    // Send the QR code image data
    response.send(Buffer.from(QR.split(',')[1], 'base64'));
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtGuard)
  @Post('turn-on')
  async turnOnTwoFactorAuthentication(
    @GetUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    this.auth2faService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      user,
    );

    await this.usersService.turnOnTwoFactorAuthentication(user);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(JwtGuard)
  @Post('authenticate')
  async authenticate(
    @GetUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    this.auth2faService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      user,
    );

    return this.authService.sendAuthResponse(user, true);
  }
}
