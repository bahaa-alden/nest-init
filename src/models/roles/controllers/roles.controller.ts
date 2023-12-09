import {
  UseGuards,
  Controller,
  SerializeOptions,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  OmitType,
  ApiCreatedResponse,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { Role } from '../entities/role.entity';
import { RolesService } from '../services/roles.service';
import { CheckAbilities } from '../../../common/decorators';
import { Action, Entities, GROUPS } from '../../../common/enums';
import { CaslAbilitiesGuard } from '../../../common/guards';

@ApiBearerAuth('token')
@ApiTags('Roles')
@UseGuards(CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Manage, subject: Entities.Role })
@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({ type: OmitType(Role, ['permissions']), isArray: true })
  @SerializeOptions({ groups: [GROUPS.ALL_ROLES] })
  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @ApiCreatedResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @SerializeOptions({
    groups: [GROUPS.ROLE],
  })
  @ApiOkResponse({ type: Role })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Role | undefined> {
    return this.rolesService.findOne(id);
  }

  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.update(id, dto);
  }

  @ApiOperation({ summary: 'add permissions to the role' })
  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Post(':id/permissions')
  async addPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.addPermissions(id, dto);
  }

  @ApiOperation({ summary: 'remove permissions from the role' })
  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Delete(':id/permissions')
  async deletePermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.deletePermissions(id, dto);
  }

  @ApiOperation({ summary: 'recover deleted role' })
  @SerializeOptions({
    groups: [GROUPS.ROLE],
  })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.rolesService.recover(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.rolesService.delete(id);
  }
}
