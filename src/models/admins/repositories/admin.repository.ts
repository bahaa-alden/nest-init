import { Injectable } from '@nestjs/common';
import { Admin, CreateAdminDto, UpdateAdminDto } from '../../../models/admins';
import { Role } from '../../../models/roles';
import { Repository, DataSource, Equal, FindOneOptions } from 'typeorm';
import { AdminPhotosRepository } from './admin-photos.repository';
import { defaultPhoto } from '../../../common/constants/default-image.constant';
import { ROLE } from '../../../common/enums';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly adminPhotosRepository: AdminPhotosRepository,
  ) {
    super(Admin, dataSource.createEntityManager());
  }

  async createOne(dto: CreateAdminDto, role: Role) {
    const admin = this.create({ ...dto, role, photos: [] });
    admin.photos.push(this.adminPhotosRepository.create(defaultPhoto));
    await admin.save();
    return admin;
  }

  async findAll(withDeleted = false) {
    return this.find({
      where: { role: withDeleted ? {} : { name: Equal(ROLE.ADMIN) } },
      withDeleted,
      relations: { photos: true, role: true },
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
      relations: { photos: true, role: true },
    };

    return await this.findOne(options);
  }

  async findByEmail(email: string, withDeleted = false) {
    const options: FindOneOptions<Admin> = {
      where: { email },
      withDeleted,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { photos: true, role: true },
    };

    return await this.findOne(options);
  }
  async updateOne(admin: Admin, dto: UpdateAdminDto) {
    admin.photos.push(await this.adminPhotosRepository.uploadPhoto(dto.photo));
    Object.assign(admin, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    await this.save(admin);
    return this.findById(admin.id);
  }

  async validate(id: string) {
    return this.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        passwordChangedAt: true,
        role: {
          id: true,
          name: true,
          permissions: {
            id: true,
            action: true,
            subject: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        photos: false,
      },
      relations: {
        role: { permissions: true },
        photos: true,
      },
    });
  }
}
