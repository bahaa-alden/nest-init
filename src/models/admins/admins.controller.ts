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
import { AdminsService } from './admins.service';
import { UpdateAdminDto, CreateAdminDto } from './dtos';
import { CaslAbilitiesGuard, JwtGuard } from '../../common/guards';
import { CheckAbilities, GetUser, Public } from '../../common/decorators';
import { Action, Entities } from '../../common/enums';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from '../../auth';
import { GROUPS } from '../../common/enums';
import { Admin } from './entities/admin.entity';
import { Role } from '../roles';

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
  login(@Body() dto: LoginDto) {
    return this.adminsService.login(dto);
  }

  @ApiBearerAuth('token')
  @UseGuards(CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ALL_ADMINS] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get()
  findAll() {
    return this.adminsService.findAll();
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
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser('role') role: Role) {
    return this.adminsService.findOne(id, role);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Update, subject: Entities.Admin })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminDto,
    @GetUser('role') role: Role,
  ) {
    return this.adminsService.update(id, dto, role);
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
