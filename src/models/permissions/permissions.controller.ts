import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { Permission } from './entities/permission.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaslAbilitiesGuard, JwtGuard } from '../../common/guards';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CheckAbilities } from '../../common/decorators/metadata';
import { Action, Entities } from '../../common/enums';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GROUPS } from '../../common/enums/groups.enum';

@ApiTags('Permissions')
@ApiBearerAuth('token')
@CheckAbilities({ action: Action.Manage, subject: Entities.Role })
@UseGuards(JwtGuard, CaslAbilitiesGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(public permissionsService: PermissionsService) {}
  @SerializeOptions({ groups: [GROUPS.ALL_PERMISSIONS] })
  @Get('')
  getAll() {
    return this.permissionsService.findAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Post()
  async create(@Body() dto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(dto);
  }

  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.findById(id);
  }

  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.delete(id);
  }

  @ApiOperation({ summary: 'recover deleted permission' })
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.recover(id);
  }
}
