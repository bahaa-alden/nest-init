import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { AdminsService } from '../services/admins.service';
import { UpdateAdminDto, CreateAdminDto, LoginAdminDto } from '../dtos';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Admin } from '../entities/admin.entity';
import { Role } from '../../roles';
import { Public, CheckAbilities, GetUser } from '../../../common/decorators';
import { GROUPS, Entities, Action } from '../../../common/enums';
import { CaslAbilitiesGuard, JwtGuard } from '../../../common/guards';
import { ICrud } from '../../../common/interfaces';
import { AdminAuthResponse } from '../interfaces';
import { denied_error, item_not_found } from '../../../common/constants';

@ApiTags('Admins')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: item_not_found('Data') })
@Controller({ path: 'admins', version: '1' })
export class AdminsController implements ICrud<Admin> {
  constructor(private readonly adminsService: AdminsService) {}

  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: AdminAuthResponse,
  })
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminsService.login(dto);
  }

  @ApiBearerAuth('token')
  @ApiOkResponse({ type: Admin })
  @UseGuards(CaslAbilitiesGuard)
  @CheckAbilities({ action: Action.Create, subject: Entities.Admin })
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiBearerAuth('token')
  @ApiOkResponse({ type: Admin })
  @UseGuards(CaslAbilitiesGuard)
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @SerializeOptions({ groups: [GROUPS.ALL_ADMINS] })
  @Get()
  get(@GetUser('role') role: Role) {
    return this.adminsService.get(role.name);
  }

  @ApiBearerAuth('token')
  @ApiOkResponse({ type: Admin })
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string, @GetUser('role') role: Role) {
    return this.adminsService.getOne(id, role.name);
  }

  @ApiBearerAuth('token')
  @ApiOkResponse({ type: Admin })
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @CheckAbilities({ action: Action.Update, subject: Entities.Admin })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdminDto) {
    return this.adminsService.update(id, dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subject: Entities.Admin })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminsService.remove(id);
  }

  @ApiOperation({ summary: 'recover deleted admin' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Admin })
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminsService.recover(id);
  }
}
