import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { PermissionsService } from '../../permissions/services/permissions.service';
import { Role } from '../entities/role.entity';
import { ICrud } from '../../../common/interfaces';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { permissions } from '../../../database/seeders/permissions/data';
import { RoleRepository } from '../repositories';

@Injectable()
export class RolesService implements ICrud<Role> {
  constructor(
    private permissionsService: PermissionsService,
    private roleRepository: RoleRepository,
  ) {}

  async get(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getOne(
    id: string,
    withDeleted?: boolean,
    relations?: string[],
  ): Promise<Role | undefined> {
    const role = await this.roleRepository.findById(id, withDeleted, relations);
    if (!role) throw new NotFoundException(item_not_found(Entities.Role));
    return role;
  }

  async findByName(name: string) {
    return this.roleRepository.findByName(name);
  }
  async create(dto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionsService.get(dto.permissionsIds);

    const role = await this.roleRepository.createOne(dto, permissions);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role | undefined> {
    const role = await this.getOne(id);

    if (!role) throw new NotFoundException(item_not_found(Entities.Role));

    const permissions = await this.permissionsService.get(dto.permissionsIds);

    return this.roleRepository.updateOne(role, permissions);
  }

  async addPermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.getOne(id);

    if (!role) throw new NotFoundException(item_not_found(Entities.Role));

    let permissions;
    if (dto.permissionsIds)
      permissions = await this.permissionsService.get(dto.permissionsIds);

    return this.roleRepository.addPermissions(role, permissions);
  }

  async deletePermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.getOne(id);

    const permissions = await this.permissionsService.get(dto.permissionsIds);

    return this.roleRepository.deletePermissions(role, permissions);
  }

  async recover(id: string): Promise<Role> {
    const role = await this.getOne(id, true, ['users', 'admins']);
    await role.recover();
    return role;
  }

  async remove(id: string) {
    const role = await this.getOne(id, false, ['users', 'admins']);
    if (!role) throw new NotFoundException(item_not_found(Entities.Role));
    await role.softRemove();
    return;
  }
}
