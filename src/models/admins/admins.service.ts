import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { LoginDto } from '../../auth/dtos';
import { ROLE } from '../../common/enums';
import { verifyHash } from '../../common/helpers';
import { Role } from '../roles/entities/role.entity';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { JwtTokenService } from '../../shared/jwt/jwt-token.service';

@Injectable()
export class AdminsService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { role: true },
    });
    if (!admin || !(await verifyHash(admin.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(
      admin.id,
      admin.email,
      ROLE.ADMIN,
    );
    return { token, admin };
  }

  findAll() {
    return this.adminRepository.find({
      where: { role: { name: Equal(ROLE.ADMIN) } },
      withDeleted: true,
    });
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id, role: { name: Equal(ROLE.SUPER_ADMIN) } },
      relations: { role: true },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    return admin;
  }

  async create(dto: CreateAdminDto) {
    const role = await this.rolesRepository.findOneBy({ name: ROLE.ADMIN });
    const admin = this.adminRepository.create({ ...dto, role });
    await this.adminRepository.insert(admin);
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    Object.assign(admin, updateAdminDto);
    await this.adminRepository.update(id, admin);
    return admin;
  }

  async recover(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!admin) throw new NotFoundException('admin not found');
    await this.adminRepository.recover(admin);
    return admin;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    // Soft delete admin using the softDelete method
    await this.adminRepository.softDelete(id);
  }
}
