import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy';
import { MailModule } from '../shared/mail/mail.module';
import { UsersModule } from '../models/users/users.module';
import { AdminsModule } from '../models/admins/admins.module';
import { EmployeesModule } from '../models/employees/employees.module';
import { RolesModule } from '../models/roles/roles.module';

@Module({
  imports: [
    PassportModule.register({}),
    MailModule,
    UsersModule,
    AdminsModule,
    EmployeesModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
