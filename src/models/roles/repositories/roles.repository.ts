import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Not, Repository, And, Equal } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UpdateRoleDto, CreateRoleDto } from '../dtos';
import { PermissionRepository } from '../../permissions/repositories/permission.repository';
import { ROLE } from '../../../common';
import { Permission } from 'src/models/permissions';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private readonly dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async createOne(dto: CreateRoleDto, permissions: Permission[]) {
    const role = this.create({
      name: dto.name,
      permissions,
    });
    await this.insert(role);
    return role;
  }

  async findAll() {
    return this.find({ where: { name: Not(ROLE.SUPER_ADMIN) } });
  }

  async findById(id: string, withDeleted = false, relations?: string[]) {
    const role = await this.findOne({
      where: { id, name: Not(ROLE.SUPER_ADMIN) },
      select: {
        id: true,
        name: true,
        permissions: {
          action: true,
          subject: true,
          id: true,
        },
        createdAt: true,
        updatedAt: true,
      },
      withDeleted,
      relations: relations ? relations : { permissions: true },
    });
    return role;
  }

  async findByName(name: string) {
    const role = await this.findOne({
      where: { name: And(Not(ROLE.SUPER_ADMIN), Equal(name)) },
      select: {
        id: true,
        name: true,
        permissions: {
          action: true,
          subject: true,
          id: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return role;
  }
  async updateOne(role: Role, permissions: Permission[]) {
    role.permissions = permissions;
    await role.save();
    return role;
  }

  async addPermissions(role: Role, permissions: Permission[]) {
    role.permissions.push(...permissions);
    await role.save();
    return this.findById(role.id);
  }

  async deletePermissions(role: Role, permissions: Permission[]) {
    await this.createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role) // you can use just post id as well
      .remove(permissions);
    return this.findById(role.id);
  }
}
