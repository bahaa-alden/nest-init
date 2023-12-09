import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from '../dtos';
import { UpdatePermissionDto } from '../dtos';
import { PermissionRepository } from '../../../shared/repositories/permission';

@Injectable()
export class PermissionsService {
  constructor(public permissionRepository: PermissionRepository) {}

  async findAll(permissionsIds?: string[]) {
    const permissions = await this.permissionRepository.findAll(permissionsIds);

    if (permissionsIds && permissionsIds.length !== permissions.length)
      throw new NotFoundException('some of permissions not found');

    return permissions;
  }

  async findOne(id: string, withDeleted?: boolean) {
    const permission = await this.permissionRepository.findById(
      id,
      withDeleted,
    );
    if (!permission) throw new NotFoundException('permission not found');
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const exist = await this.permissionRepository.findOne({
      where: { action: dto.action, subject: dto.subject },
    });
    if (exist) throw new ConflictException('permission already exist');
    const permissions = await this.permissionRepository.createOne(dto);
    return permissions;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    return this.permissionRepository.updateOne(permission, dto);
  }

  async recover(id: string) {
    const permission = await this.findOne(id, true);
    await permission.recover();
    return permission;
  }

  async delete(id: string) {
    const permission = await this.findOne(id);
    return await permission.softRemove();
  }
}
