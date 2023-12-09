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
import {
  UpdateAdminDto,
  CreateAdminDto,
  LoginResponseDto,
  LoginAdminDto,
} from '../dtos';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Admin } from '../entities/admin.entity';
import { Role } from '../../roles';
import { Public, CheckAbilities, GetUser } from '../../../common/decorators';
import { GROUPS, Entities, Action } from '../../../common/enums';
import { CaslAbilitiesGuard, JwtGuard } from '../../../common/guards';

@ApiTags('Admins')
@Controller({ path: 'admins', version: '1' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Public()
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminsService.login(dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Create, subject: Entities.Admin })
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ALL_ADMINS] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get()
  findAll(@GetUser('role') role: Role) {
    return this.adminsService.findAll(role.name);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser('role') role: Role) {
    return this.adminsService.findOne(id, role.name);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
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
