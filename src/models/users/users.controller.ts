import {
  UseGuards,
  UseInterceptors,
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  SerializeOptions,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { CheckAbilities, Roles } from '../../common/decorators/metadata';
import { GetUser } from '../../common/decorators/requests';
import { JwtGuard, CaslAbilitiesGuard, RolesGuard } from '../../common/guards';
import { LoggingInterceptor } from '../../common/interceptors';
import { CaslAbilityFactory } from '../../shared/casl/casl-ability.factory';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { Action, Entities, ROLE } from '../../common/enums';

import { GROUPS } from '../../common/enums/groups.enum';

@ApiTags('users')
@ApiBearerAuth('token')
@UseGuards(JwtGuard, CaslAbilitiesGuard, RolesGuard)
@UseInterceptors(new LoggingInterceptor())
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private usersService: UsersService) {}

  @SerializeOptions({ groups: [GROUPS.ALL_USERS] })
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  getAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Patch('me')
  updateMe(@Body() dto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.updateMe(dto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Delete('me')
  deleteMe(@GetUser() user: User) {
    return this.usersService.deleteMe(user);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    allowEmptyValue: false,
    required: true,
  })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    allowEmptyValue: false,
    required: true,
  })
  @CheckAbilities({ action: Action.Delete, subject: Entities.User })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'recover deleted user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    allowEmptyValue: false,
    required: true,
  })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.recover(id);
  }
}
