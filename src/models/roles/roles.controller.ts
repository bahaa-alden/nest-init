import {
  Controller,
  UseGuards,
  Patch,
  Param,
  Body,
  Delete,
  Get,
  Post,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CaslAbilitiesGuard, JwtGuard } from '../../common/guards';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { CheckAbilities } from '../../common/decorators/metadata';
import { Action } from '../../common/enums/action.enum';
import { Entities } from '../../common/enums';
import { UUID } from 'crypto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CaslAbilityFactory } from '../../shared/casl/casl-ability.factory';
import { Role } from './entities/role.entity';
import { GROUPS } from '../../common/enums/groups.enum';

@ApiBearerAuth('token')
@ApiTags('Roles')
@UseGuards(JwtGuard, CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Manage, subject: Entities.Role })
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({ type: OmitType(Role, ['permissions']), isArray: true })
  @SerializeOptions({ groups: [GROUPS.ALL_ROLES] })
  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @SerializeOptions({
    groups: [GROUPS.ROLE],
  })
  @ApiOkResponse({ type: Role })
  @ApiParam({ name: 'id' })
  @Get(':id')
  async findById(@Param('id') id: UUID): Promise<Role | undefined> {
    return this.rolesService.findById(id);
  }

  @ApiCreatedResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(dto);
  }

  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.update(id, dto);
  }

  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Post(':id/permissions')
  async addPermissions(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.addPermissions(id, dto);
  }

  @ApiOkResponse({ type: Role })
  @SerializeOptions({ groups: [GROUPS.ROLE] })
  @Delete(':id/permissions')
  async deletePermissions(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    return this.rolesService.deletePermissions(id, dto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: UUID): Promise<Role> {
    return this.rolesService.recover(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    return this.rolesService.delete(id);
  }
}
