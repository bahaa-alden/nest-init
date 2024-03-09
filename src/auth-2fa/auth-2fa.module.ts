import { Module } from '@nestjs/common';
import { Auth2faService } from './auth-2fa.service';
import { Auth2faController } from './auth-2fa.controller';
import { UsersModule } from '../models/users/users.module';
import { JwtTwoFactorStrategy } from './strategies/2fa.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [Auth2faController],
  providers: [Auth2faService, JwtTwoFactorStrategy],
})
export class Auth2faModule {}
