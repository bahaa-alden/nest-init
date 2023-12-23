import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ROLE } from '../../../common/enums';
import { JwtTokenService } from '../../../shared/jwt';
import { Role } from '../../roles';
import { CreateAdminDto, LoginAdminDto, UpdateAdminDto } from '../dtos';
import { Admin } from '../entities/admin.entity';
import { RoleRepository } from '../../../shared/repositories/role';
import { AdminRepository } from '../../../shared/repositories/admin';
import { AdminAuthResponse } from '../interfaces';
import { ICrud } from '../../../common/interfaces';

@Injectable()
export class AdminsService implements ICrud<Admin> {
  constructor(
    private jwtTokenService: JwtTokenService,
    private roleRepository: RoleRepository,
    private adminRepository: AdminRepository,
  ) {}

  async login(dto: LoginAdminDto): Promise<AdminAuthResponse> {
    const admin = await this.adminRepository.findByEmail(dto.email);
    if (!admin || !(await admin.verifyHash(admin.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(admin.id, ROLE.ADMIN);
    return { token, admin };
  }

  get(role: string) {
    const withDeleted = role === ROLE.SUPER_ADMIN ? true : false;
    return this.adminRepository.findAll(withDeleted);
  }

  async getOne(id: string, role: string = ROLE.SUPER_ADMIN) {
    const withDeleted = role === ROLE.SUPER_ADMIN ? true : false;
    const admin = await this.adminRepository.findById(id, withDeleted);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    return admin;
  }

  async create(dto: CreateAdminDto) {
    const role = await Role.findOneBy({ name: ROLE.ADMIN });

    const admin = await this.adminRepository.createOne(dto, role);

    return admin;
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.getOne(id);

    return this.adminRepository.updateOne(admin, dto);
  }

  async recover(id: string) {
    const admin = await this.getOne(id);
    await admin.recover();
    return admin;
  }

  async remove(id: string): Promise<void> {
    const admin = await this.getOne(id);
    await admin.softRemove();
  }
}
