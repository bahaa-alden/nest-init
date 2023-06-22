import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { UsersModule } from '../users/users.module'; // Import the UsersModule
import { User, userSchema } from '../users/schema/users.schema'; // Update the import statement
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, // Add the UsersModule to imports
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
