import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { LoginDto } from '../../../auth';
import { ROLE } from '../../../common';
import { CloudinaryService } from '../../../shared/cloudinary';
import { JwtTokenService } from '../../../shared/jwt';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { EmployeeImage } from '../entities/employee-image.entity';
import { Employee } from '../entities/employee.entity';
import { StoresService } from '../../stores/services/stores.service';
import {
  EmployeeRepository,
  RoleRepository,
} from '../../../shared/repositories';

@Injectable()
export class EmployeesService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private employeeRepository: EmployeeRepository,
    private roleRepository: RoleRepository,
    private storesService: StoresService,
  ) {}

  async login(dto: LoginDto) {
    const employee = await this.employeeRepository.findByEmail(dto.email);
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

  async findOne(id: string, withDeleted?: boolean) {
    const employee = await this.employeeRepository.findById(id, withDeleted);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    await this.storesService.findOne(dto.storeId);
    const role = await this.roleRepository.findByName(ROLE.EMPLOYEE);
    return this.employeeRepository.createOne(dto, role);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    await this.storesService.findOne(dto.storeId);
    return this.employeeRepository.updateOne(employee, dto);
  }

  async recover(id: string) {
    const employee = await this.findOne(id, true);
    await this.employeeRepository.recover(employee);
    return employee;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.employeeRepository.softDelete(id);
    return;
  }
}
