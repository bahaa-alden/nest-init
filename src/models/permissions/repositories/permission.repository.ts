import { Injectable } from '@nestjs/common';
import { Action, Entities } from '../../../common/enums';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}
  async find(permissionsIds?: string[]) {
    let permissions = this.permissionRepo
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      );
    permissions = permissionsIds
      ? permissions.andWhereInIds(permissionsIds)
      : permissions;

    return permissions.getMany();
  }
  async findOne(id: string, withDeleted = false) {
    let permission = this.permissionRepo
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhere('permission.id = :id', { id });
    permission = withDeleted ? permission.withDeleted() : permission;
    return permission.getOne();
  }

  async findUnique(action: Action, subject: Entities) {
    return this.permissionRepo.findOne({
      where: { action, subject },
    });
  }

  async create(dto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(dto);
    await this.permissionRepo.insert(permission);
    return permission;
  }

  async update(permission: Permission, dto: UpdatePermissionDto) {
    Object.assign<Permission, UpdatePermissionDto>(permission, dto);
    await permission.save();
    return this.findOne(permission.id);
  }
}
