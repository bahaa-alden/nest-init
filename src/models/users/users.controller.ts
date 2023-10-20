import {
  UseGuards,
  UseInterceptors,
  Controller,
  SerializeOptions,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles, CheckAbilities } from '../../common/decorators';
import { GetUser } from '../../common/decorators';
import { GROUPS, ROLE, Entities, Action } from '../../common/enums';
import { CaslAbilitiesGuard, RolesGuard } from '../../common/guards';
import { LoggingInterceptor } from '../../common/interceptors';
import { UpdateUserDto } from './dtos';
import { User } from './entities';
import { UsersService } from './users.service';
import { Role } from '../roles';

@ApiTags('users')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard, RolesGuard)
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

  @SerializeOptions({ groups: [GROUPS.USER] })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @SerializeOptions({ groups: [GROUPS.USER] })
  @ApiOkResponse({ type: User })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @CheckAbilities({ action: Action.Delete, subject: Entities.User })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'recover deleted user' })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.recover(id);
  }
}
