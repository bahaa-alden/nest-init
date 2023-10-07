import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LoggerMiddleware } from '../common/middlewares';
import { Role } from '../models/roles';
import { User, UserImage } from '../models/users';
import { JwtTokenModule } from '../shared/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { Admin } from '../models/admins';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Role, UserImage]),
    JwtTokenModule,
    PassportModule.register({}),
  ],
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
