import { Injectable } from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import { Action, Entities } from './../../../common';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private readonly dataSource: DataSource) {
    super(Permission, dataSource.createEntityManager());
  }

  async findAll(permissionsIds?: string[]) {
    let permissions = this.createQueryBuilder('permission').where(
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
  async findById(id: string, withDeleted = false) {
    let permission = this.createQueryBuilder('permission')
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

  async createOne(dto: CreatePermissionDto) {
    const permission = this.create(dto);
    await this.insert(permission);
    return permission;
  }

  async updateOne(permission: Permission, dto: UpdatePermissionDto) {
    Object.assign<Permission, UpdatePermissionDto>(permission, dto);
    await permission.save();
    return this.findById(permission.id);
  }
}
