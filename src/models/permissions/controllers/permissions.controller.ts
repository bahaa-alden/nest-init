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
import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../entities/permission.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CreatePermissionDto } from '../dtos';
import { CheckAbilities } from '../../../common/decorators';
import { Action, Entities, GROUPS } from '../../../common/enums';
import { UpdatePermissionDto } from '../dtos';
import { ICrud } from '../../../common/interfaces';
import { denied_error } from '../../../common/constants';

@ApiTags('Permissions')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: 'Data Not found' })
@CheckAbilities({ action: Action.Manage, subject: Entities.Permission })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'permissions', version: '1' })
export class PermissionsController implements ICrud<Permission> {
  constructor(public permissionsService: PermissionsService) {}
  @ApiOkResponse({
    type: OmitType(Permission, ['createdAt', 'updatedAt']),
    isArray: true,
  })
  @SerializeOptions({ groups: [GROUPS.ALL_PERMISSIONS] })
  @Get('')
  get() {
    return this.permissionsService.get();
  }

  @ApiCreatedResponse({ type: Permission })
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Post()
  async create(@Body() dto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(dto);
  }

  @ApiOkResponse({ type: Permission })
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.getOne(id);
  }

  @ApiOkResponse({ type: Permission })
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, dto);
  }

  @ApiNoContentResponse({ type: Permission })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.remove(id);
  }

  @ApiOkResponse({ type: Permission })
  @ApiOperation({ summary: 'recover deleted permission' })
  @SerializeOptions({ groups: [GROUPS.PERMISSION] })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.recover(id);
  }
}
