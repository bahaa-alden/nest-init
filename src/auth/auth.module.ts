import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './strategy';
import { UsersModule } from '../users/users.module'; // Import the UsersModule

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, // Add the UsersModule to imports
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
