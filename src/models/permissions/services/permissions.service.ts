import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from '../dtos';
import { UpdatePermissionDto } from '../dtos';
import { Permission } from '../entities/permission.entity';
import { ICrud } from '../../../common/interfaces';
import { item_already_exist, item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { PermissionRepository } from '../repositories/permission.repository';

@Injectable()
export class PermissionsService implements ICrud<Permission> {
  constructor(public permissionRepository: PermissionRepository) {}

  async find(permissionsIds?: string[]) {
    const permissions = await this.permissionRepository.find(permissionsIds);

    if (permissionsIds && permissionsIds.length !== permissions.length)
      throw new NotFoundException('some of permissions not found');

    return permissions;
  }

  async findOne(id: string, withDeleted?: boolean) {
    const permission = await this.permissionRepository.findOne(id, withDeleted);
    if (!permission)
      throw new NotFoundException(item_not_found(Entities.Permission));
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const exist = await this.permissionRepository.findUnique(
      dto.action,
      dto.subject,
    );
    if (exist)
      throw new ConflictException(item_already_exist(Entities.Permission));
    const permissions = await this.permissionRepository.create(dto);
    return permissions;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    return this.permissionRepository.update(permission, dto);
  }

  async recover(id: string) {
    const permission = await this.findOne(id, true);
    await permission.recover();
    return permission;
  }

  async remove(id: string) {
    const permission = await this.findOne(id);
    await permission.softRemove();
    return;
  }
}
