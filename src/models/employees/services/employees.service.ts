import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { Entities, ROLE } from '../../../common/enums';
import { JwtTokenService } from '../../../shared/jwt';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../../../shared/repositories/employee';
import { LoginDto } from '../../../auth';
import { RoleRepository } from '../../../shared/repositories/role';
import { StoreRepository } from '../../../shared/repositories/store/store.repository';
import { AuthEmployeeResponse } from '../interfaces';
import { ICrud } from '../../../common/interfaces';
import {
  incorrect_credentials,
  item_not_found,
} from '../../../common/constants';

@Injectable()
export class EmployeesService implements ICrud<Employee> {
  constructor(
    private jwtTokenService: JwtTokenService,
    private employeeRepository: EmployeeRepository,
    private roleRepository: RoleRepository,
    private storeRepository: StoreRepository,
  ) {}

  async login(dto: LoginDto): Promise<AuthEmployeeResponse> {
    const employee = await this.employeeRepository.findByIdOrEmail(dto.email);
    if (
      !employee ||
      !(await employee.verifyHash(employee.password, dto.password))
    ) {
      throw new UnauthorizedException(incorrect_credentials);
    }
    const token = await this.jwtTokenService.signToken(
      employee.id,
      Employee.name,
    );
    return { token, employee };
  }

  get() {
    return this.employeeRepository.find({
      withDeleted: true,
      relations: ['store'],
    });
  }

  async getOne(id: string, withDeleted?: boolean) {
    const employee = await this.employeeRepository.findByIdOrEmail(
      id,
      withDeleted,
    );
    if (!employee) {
      throw new NotFoundException(item_not_found(Entities.Employee));
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const role = await this.roleRepository.findOneBy({ name: ROLE.EMPLOYEE });
    const store = await this.storeRepository.findById(dto.storeId);
    return this.employeeRepository.createOne(dto, store, role);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.getOne(id);
    const store = await this.storeRepository.findById(dto.storeId);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    return this.employeeRepository.updateOne(employee, dto, store);
  }

  async recover(id: string) {
    const employee = await this.getOne(id, true);
    await this.employeeRepository.recover(employee);
    return employee;
  }

  async remove(id: string): Promise<void> {
    await this.getOne(id);
    await this.employeeRepository.softDelete(id);
    return;
  }
}
