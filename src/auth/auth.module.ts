import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PassportModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
