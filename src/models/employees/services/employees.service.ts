import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Entities, ROLE } from '../../../common/enums';
import { JwtTokenService } from '../../../shared/jwt';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { LoginDto } from '../../../auth';
import { AuthEmployeeResponse } from '../interfaces';
import {
  incorrect_credentials,
  item_not_found,
} from '../../../common/constants';
import { IEmployeeService } from '../interfaces/employee-services.interface';
import { PaginatedResponse } from '../../../common/types';
import { IEmployeeRepository } from '../interfaces/repositories/employee.repository.interface';
import { EMPLOYEE_TYPES } from '../interfaces/type';
import { STORE_TYPES } from '../../stores/interfaces/type';
import { IStoreRepository } from '../../stores/interfaces/repositories/store.repository.interface';
import { IRoleRepository } from '../../roles/interfaces/repositories/role.repository.interface';
import { ROLE_TYPES } from '../../roles/interfaces/type';

@Injectable()
export class EmployeesService implements IEmployeeService {
  constructor(
    private jwtTokenService: JwtTokenService,
    @Inject(EMPLOYEE_TYPES.repository.employee)
    private employeeRepository: IEmployeeRepository,
    @Inject(ROLE_TYPES.repository)
    private roleRepository: IRoleRepository,
    @Inject(STORE_TYPES.repository)
    private storeRepository: IStoreRepository,
  ) {}

  async login(dto: LoginDto): Promise<AuthEmployeeResponse> {
    const employee = await this.employeeRepository.findOneByEmail(dto.email);
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

  async find(
    withDeleted: boolean,
  ): Promise<Employee[] | PaginatedResponse<Employee>> {
    return this.employeeRepository.find(withDeleted);
  }

  async findOne(id: string, withDeleted?: boolean): Promise<Employee> {
    const employee = await this.employeeRepository.findOneById(id, withDeleted);
    if (!employee) {
      throw new NotFoundException(item_not_found(Entities.Employee));
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const role = await this.roleRepository.findByName(ROLE.EMPLOYEE);
    const store = await this.storeRepository.findOneById(dto.storeId);
    return this.employeeRepository.create(dto, store, role);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const store = await this.storeRepository.findOneById(dto.storeId);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    return this.employeeRepository.update(employee, dto, store);
  }

  async recover(id: string): Promise<Employee> {
    const employee = await this.findOne(id, true);
    await this.employeeRepository.recover(employee);
    return employee;
  }

  async remove(id: string): Promise<void> {
    const emp = await this.findOne(id);
    await this.employeeRepository.remove(emp);
    return;
  }
}
