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
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CaslAbilitiesGuard, JwtGuard } from '../../common/guards';
import { CheckAbilities } from '../../common/decorators/metadata';
import { Action, Entities } from '../../common/enums';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from '../../auth/dtos';
import { GROUPS } from '../../common/enums/groups.enum';
import { Admin } from './entities/admin.entity';

@ApiTags('Admins')
@Controller({ path: 'admins', version: '1' })
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

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
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ALL_ADMINS] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Create, subject: Entities.Admin })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Read, subject: Entities.Admin })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminsService.findOne(id);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @SerializeOptions({ groups: [GROUPS.ADMIN] })
  @ApiOkResponse({ type: Admin })
  @CheckAbilities({ action: Action.Update, subject: Entities.Admin })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtGuard, CaslAbilitiesGuard)
  @CheckAbilities({ action: Action.Delete, subject: Entities.Admin })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminsService.remove(id);
  }
}
