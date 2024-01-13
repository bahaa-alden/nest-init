import { Role } from '../../../roles';
import { CreateAdminDto, UpdateAdminDto } from '../../dtos';
import { Admin } from '../../entities/admin.entity';

export interface IAdminRepository {
  findAll(withDeleted: boolean): Promise<Admin[]>;

  findById(id: string, withDeleted: boolean): Promise<Admin>;

  findByEmail(email: string, withDeleted?: boolean): Promise<Admin>;

  create(dto: CreateAdminDto, role: Role): Promise<Admin>;

  update(admin: Admin, dto: UpdateAdminDto): Promise<Admin>;

  recover(admin: Admin): Promise<Admin>;

  remove(admin: Admin): Promise<void>;

  validate(id: string): Promise<Admin>;
}
