import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Action, Entities } from '../../common/enums';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    public permissionRepository: Repository<Permission>,
  ) {}

  findAll() {
    return this.permissionRepository.find();
  }

  async findById(id: UUID) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) throw new NotFoundException('permission not found');
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const exist = await this.permissionRepository.findOne({
      where: { action: dto.action, subject: dto.subject },
    });
    if (exist) throw new BadRequestException('permission already exist');
    const permissions = this.permissionRepository.create(dto);
    await this.permissionRepository.insert(permissions);
    return permissions;
  }

  async delete(id: UUID) {
    const permission = await this.permissionRepository
      .createQueryBuilder('permission')
      .where(
        '(permission.subject != :subject) AND (permission.action != :action)',
        {
          subject: Entities.All,
          action: Action.Manage,
        },
      )
      .whereInIds([id])
      .getOne();
    if (!permission) throw new NotFoundException('permission not found');

    return this.permissionRepository.softRemove(permission);
  }
}
