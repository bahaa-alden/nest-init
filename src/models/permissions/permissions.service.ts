import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dtos';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Action, Entities } from '../../common/enums';
import { UpdatePermissionDto } from './dtos';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    public permissionRepository: Repository<Permission>,
  ) {}

  findAll() {
    return this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .getMany();
  }

  async findById(id: string) {
    const permission = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhere('permission.id = :id', { id })
      .getOne();
    if (!permission) throw new NotFoundException('permission not found');
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const exist = await this.permissionRepository.findOne({
      where: { action: dto.action, subject: dto.subject },
    });
    if (exist) throw new ConflictException('permission already exist');
    const permissions = this.permissionRepository.create(dto);
    await this.permissionRepository.insert(permissions);
    return permissions;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhere('permission.id = :id', { id })
      .getOne();

    if (!permission) throw new NotFoundException('permission not found');

    Object.assign(permission, dto);
    await permission.save();
    return permission;
  }

  async recover(id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!permission) throw new NotFoundException('permission not found');
    await permission.recover();
    return permission;
  }

  async delete(id: string) {
    const permission = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject OR permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .andWhere('permission.id = :id', { id })
      .getOne();
    if (!permission) throw new NotFoundException('permission not found');

    return await permission.softRemove();
  }
}
