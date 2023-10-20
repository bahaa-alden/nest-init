import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Equal,
  FindOneOptions,
  FindOptionsWhere,
  Not,
} from 'typeorm';
import { LoginDto } from '../../auth';
import { ROLE } from '../../common/enums';
import { JwtTokenService } from '../../shared/jwt';
import { Role } from '../roles';
import { CreateAdminDto, UpdateAdminDto } from './dtos';
import { Admin } from './entities/admin.entity';
import { checkIfExist } from '../../common/helpers';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';
import { defaultImage } from '../../common/constants';
import { AdminImage } from './entities/admin-image.entity';

@Injectable()
export class AdminsService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminImage)
    private adminImageRepository: Repository<AdminImage>,
    private cloudinaryService: CloudinaryService,
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
      relations: { role: true, images: true },
    });
    if (!admin || !(await admin.verifyHash(admin.password, dto.password))) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(admin.id, ROLE.ADMIN);
    return { token, admin };
  }

  findAll() {
    return this.adminRepository.find({
      where: { role: { name: Equal(ROLE.ADMIN) } },
      withDeleted: true,
    });
  }

  async findOne(id: string, role?: Role) {
    let where: FindOptionsWhere<Admin> = {};
    if (role.name === ROLE.SUPER_ADMIN) where = { id };
    else where = { id, role: { name: Not(ROLE.SUPER_ADMIN) } };

    const admin = await this.adminRepository.findOne({
      where,
      relations: { role: true, images: true },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found.`);
    }
    return admin;
  }

  async create(dto: CreateAdminDto) {
    const role = await this.roleRepository.findOneBy({ name: ROLE.ADMIN });
    const admin = this.adminRepository.create({ ...dto, role, images: [] });
    admin.images.push(this.adminImageRepository.create(defaultImage));
    await this.adminRepository.save(admin);
    return admin;
  }

  async update(id: string, dto: UpdateAdminDto, role: Role): Promise<Admin> {
    const admin = await this.findOne(id, role);
    if (dto.photo) admin.images.push(await this.updatePhoto(dto.photo));
    Object.assign(admin, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    await this.adminRepository.save(admin);
    return admin;
  }

  async recover(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found.`);
    await this.adminRepository.recover(admin);
    return admin;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.adminRepository.softDelete(id);
  }

  async updatePhoto(url: string) {
    const res = await checkIfExist(url);
    const uploaded = await this.cloudinaryService.uploadSingleImage(res);
    const photo = this.adminImageRepository.create(uploaded);
    return photo;
  }
}
