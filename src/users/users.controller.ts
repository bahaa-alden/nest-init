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
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './user.entity';

@Crud({
  model: {
    type: User,
  },
})
@UseInterceptors(new LoggingInterceptor())
@UseGuards(JwtGuard)
@ApiTags('users')
@ApiBearerAuth('token')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  @ApiOkResponse({ type: UpdateUserDto, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  @ApiOkResponse({ type: UpdateUserDto })
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }
}
