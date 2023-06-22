import {
  Body,
  Controller,
  Get,
  Header,
  Patch,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from './../auth/guard';
import { GetUser } from './../auth/decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos';
import { LoggingInterceptor } from '../core/interceptor';
import { IUser } from './interface/users.interface';

@UseInterceptors(new LoggingInterceptor())
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: IUser) {
    return user;
  }
  @Patch('me')
  async updateUser(@GetUser('id') id: string, @Body() dto: UpdateUserDto) {
    // return this.usersService.updateUser(id, dto);
  }
}
