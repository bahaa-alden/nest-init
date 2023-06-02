import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from './../auth/guard';
import { GetUser } from './../auth/decorator';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }
}
