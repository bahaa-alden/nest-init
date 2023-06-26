import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from './../auth/guard';
import { GetUser } from './../auth/decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos';
import { LoggingInterceptor } from '../core/interceptor';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@UseInterceptors(new LoggingInterceptor())
@UseGuards(JwtGuard)
@ApiTags('users')
@ApiBearerAuth('token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: UpdateUserDto, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  getAllUsers(@Query('name') name: string) {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: UpdateUserDto })
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }

  @Patch('me')
  async updateUser(@GetUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
