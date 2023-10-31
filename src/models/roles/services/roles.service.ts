import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ROLE, Entities, Action } from '../../../common';
import { Permission } from '../../permissions';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { Role } from '../entities/role.entity';
import { RoleRepository } from '../repositories/roles.repository';
import { PermissionsService } from '../../permissions/services/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    private permissionsService: PermissionsService,
    private roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async findOne(
    id: string,
    withDeleted?: boolean,
    relations?: string[],
  ): Promise<Role | undefined> {
    const role = await this.roleRepository.findById(id, withDeleted, relations);
    if (!role) throw new NotFoundException('role not found');
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionsService.findAll(dto.permissions);

    const role = await this.roleRepository.createOne(dto, permissions);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role | undefined> {
    const role = await this.findOne(id);

    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionsService.findAll(dto.permissions);

    return this.roleRepository.updateOne(role, permissions);
  }

  async addPermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.findOne(id);

    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionsService.findAll(dto.permissions);

    return this.roleRepository.addPermissions(role, permissions);
  }

  async deletePermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.findOne(id);

    const permissions = await this.permissionsService.findAll(dto.permissions);

    return this.roleRepository.deletePermissions(role, permissions);
  }

  async recover(id: string): Promise<Role> {
    const role = await this.findOne(id, true, ['users', 'admins']);

    await role.recover();

    return role;
  }

  async delete(id: string) {
    const role = await this.findOne(id, false, ['users', 'admins']);

    if (!role) throw new NotFoundException('role not found');
    await role.softRemove();
    return;
  }
}
