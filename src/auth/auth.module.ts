import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middlewares';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [PassportModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '/auth/login',
      method: RequestMethod.POST,
      version: '1',
    });
  }
}
