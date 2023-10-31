import { Injectable } from '@nestjs/common';
import {
  DataSource,
  Equal,
  FindOneOptions,
  FindOptions,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from '../dtos';
import { AdminImagesRepository } from './admin-images.repository';
import { ROLE, defaultImage } from './../../../common';
import { Role } from 'src/models/roles';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly adminImagesRepository: AdminImagesRepository,
  ) {
    super(Admin, dataSource.createEntityManager());
  }

  async createOne(dto: CreateAdminDto, role: Role) {
    const admin = this.create({ ...dto, role, images: [] });
    admin.images.push(this.adminImagesRepository.create(defaultImage));
    await admin.save();
    return admin;
  }

  async findAll(withDeleted = false) {
    return this.find({
      where: { role: withDeleted ? {} : { name: Equal(ROLE.ADMIN) } },
      withDeleted,
      relations: { images: true, role: true },
    });
  }

  async findById(id: string, withDeleted = false) {
    const options: FindOneOptions<Admin> = {
      where: { id, role: withDeleted ? {} : { name: Equal(ROLE.ADMIN) } },
      withDeleted,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { images: true, role: true },
    };

    return await this.findOne(options);
  }

  async findByEmail(email: string) {
    return await this.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { images: true, role: true },
    });
  }

  async updateOne(admin: Admin, dto: UpdateAdminDto) {
    admin.images.push(await this.adminImagesRepository.updatePhoto(dto.photo));
    Object.assign(admin, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    await this.save(admin);
    return this.findById(admin.id);
  }
}
