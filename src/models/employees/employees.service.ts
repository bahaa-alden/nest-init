import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { LoginDto } from '../../auth';
import { defaultImage } from '../../common/constants';
import { ROLE } from '../../common/enums';
import { checkIfExist } from '../../common/helpers';
import { CloudinaryService } from '../../shared/cloudinary';
import { JwtTokenService } from '../../shared/jwt';
import { Role } from '../roles';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { EmployeeImage } from './entities/employee-image.entity';
import { Employee } from './entities/employee.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class EmployeesService {
  constructor(
    private jwtTokenService: JwtTokenService,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeImage)
    private employeeImageRepository: Repository<EmployeeImage>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private storesService: StoresService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async login(dto: LoginDto) {
    const employee = await this.employeeRepository.findOne({
      where: { email: dto.email },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { role: true, images: true, store: true },
    });
    if (
      !employee ||
      !(await employee.verifyHash(employee.password, dto.password))
    ) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const token = await this.jwtTokenService.signToken(
      employee.id,
      ROLE.EMPLOYEE,
    );
    return { token, employee };
  }

  findAll() {
    return this.employeeRepository.find({
      withDeleted: true,
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { role: true, images: true, store: true },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    await this.storesService.findOne(dto.storeId);
    const role = await this.roleRepository.findOneBy({ name: ROLE.EMPLOYEE });
    const employee = this.employeeRepository.create({
      ...dto,
      role,
      images: [],
    });
    employee.images.push(this.employeeImageRepository.create(defaultImage));
    const s = await this.employeeRepository.save(employee);
    return s;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    if (dto.storeId) {
      const store = await this.storesService.findOne(dto.storeId);
      employee.store = store;
    }
    if (dto.photo) employee.images.push(await this.updatePhoto(dto.photo));
    Object.assign(employee, {
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    await this.employeeRepository.save(employee);
    return employee;
  }

  async recover(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!employee)
      throw new NotFoundException(`employee with ID ${id} not found.`);
    await this.employeeRepository.recover(employee);
    return employee;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.employeeRepository.softDelete(id);
  }

  async updatePhoto(url: string) {
    const res = await checkIfExist(url);
    const uploaded = await this.cloudinaryService.uploadSingleImage(res);
    const photo = this.employeeImageRepository.create(uploaded);
    return photo;
  }
}
