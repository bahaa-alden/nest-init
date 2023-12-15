import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { ROLE } from '../../../common/enums';
import { JwtTokenService } from '../../../shared/jwt';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../../../shared/repositories/employee';
import { LoginUserDto } from '../../../auth';
import { RoleRepository } from '../../../shared/repositories/role';
import { StoreRepository } from '../../../shared/repositories/store/store.repository';

@Injectable()
export class EmployeesService {
  constructor(
    private jwtTokenService: JwtTokenService,
    private employeeRepository: EmployeeRepository,
    private roleRepository: RoleRepository,
    private storeRepository: StoreRepository,
  ) {}

  async login(dto: LoginUserDto) {
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
      relations: ['store'],
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
    const role = await this.roleRepository.findOneBy({ name: ROLE.EMPLOYEE });
    const store = await this.storeRepository.findById(dto.storeId);
    return this.employeeRepository.createOne(dto, store, role);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const store = await this.storeRepository.findById(dto.storeId);
    if (!store) throw new NotFoundException('store not found');
    return this.employeeRepository.updateOne(employee, dto, store);
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
