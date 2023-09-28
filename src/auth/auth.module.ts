import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoggerMiddleware } from '../common/middlewares';
import { User } from '../models/users/entities/users.entity';
import { Role } from '../models/roles/entities/role.entity';
import { JwtTokenModule } from '../shared/jwt/jwt-token.module';
import { JwtStrategy } from './strategy';
import { Admin } from '../models/admins/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin, Role]),
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
