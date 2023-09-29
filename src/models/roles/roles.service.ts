import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Action, Entities, ROLE } from '../../common/enums';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ where: { name: Not(ROLE.SUPER_ADMIN) } });
  }

  async findById(id: string): Promise<Role | undefined> {
    const role = await this.roleRepository.findOne({
      where: { id, name: Not(ROLE.SUPER_ADMIN) },
      select: {
        id: true,
        name: true,
        permissions: {
          action: true,
          subject: true,
          id: true,
        },
      },
      relations: { permissions: true },
    });
    if (!role) throw new NotFoundException('role not found');
    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhereInIds(dto.permissions)
      .getMany();

    const role = this.roleRepository.create({
      name: dto.name,
      permissions,
    });
    await this.roleRepository.insert(role);
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role | undefined> {
    const role = await this.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhereInIds(dto.permissions)
      .getMany();

    role.permissions = permissions;

    await this.roleRepository.save(role);
    return role;
  }

  async addPermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhereInIds(dto.permissions)
      .getMany();

    if (dto.permissions.length !== permissions.length)
      throw new NotFoundException('some of permissions not found');

    role.permissions.forEach((p) => {
      if (permissions.find((pe) => pe.id === p.id))
        throw new ConflictException(
          `Permission with ID ${p.id} already exist in the role.`,
        );
    });
    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role) // you can use just post id as well
      .add(permissions);

    return this.findById(id);
  }

  async deletePermissions(
    id: string,
    dto: UpdateRoleDto,
  ): Promise<Role | undefined> {
    const role = await this.findById(id);
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .whereInIds(dto.permissions)
      .getMany();

    if (dto.permissions.length !== permissions.length)
      throw new NotFoundException('some of permissions not found');

    permissions.forEach((p) => {
      if (!role.permissions.find((pe) => pe.id === p.id))
        throw new NotFoundException(
          `Permission with ID ${p.id} not found in the role.`,
        );
    });
    await this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role) // you can use just post id as well
      .remove(permissions);

    return this.findById(id);
  }

  async recover(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, name: Not(ROLE.SUPER_ADMIN) },
      withDeleted: true,
      relations: ['users', 'admins'],
    });

    if (!role) throw new NotFoundException('role not found');
    await this.roleRepository.recover(role);
    return role;
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id, name: Not(ROLE.SUPER_ADMIN) },

      relations: ['users', 'admins'],
    });

    if (!role) throw new NotFoundException('role not found');
    await this.roleRepository.softRemove(role);
  }
}
