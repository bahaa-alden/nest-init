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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { UpdateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { GetUser, Roles, CheckAbilities } from '../../../common/decorators';
import { GROUPS, ROLE, Entities, Action } from '../../../common/enums';
import { CaslAbilitiesGuard, RolesGuard } from '../../../common/guards';
import { LoggingInterceptor } from '../../../common/interceptors';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';

@ApiTags('users')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController implements ICrud<User> {
  constructor(private usersService: UsersService) {}

  @SerializeOptions({ groups: [GROUPS.ALL_USERS] })
  @ApiOkResponse({ type: PaginatedResponse<User> })
  @ApiQuery({
    name: 'page',
    allowEmptyValue: false,
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    allowEmptyValue: false,
    example: 10,
    required: false,
  })
  @Get()
  get(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetUser() user: User,
  ) {
    return this.usersService.get(page, limit, user);
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

  create(...n: any[]): Promise<User> {
    return;
  }
  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getOne(id);
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.User })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
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
