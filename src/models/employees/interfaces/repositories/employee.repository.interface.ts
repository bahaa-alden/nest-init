import { Role } from '../../../roles';
import { Store } from '../../../stores';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dtos';
import { Employee } from '../../entities/employee.entity';

export interface IEmployeeRepository {
  find(withDeleted: boolean): Promise<Employee[]>;

  findOneById(id: string, withDeleted: boolean): Promise<Employee>;

  findOneByEmail(email: string, withDeleted?: boolean): Promise<Employee>;

  create(dto: CreateEmployeeDto, store: Store, role: Role): Promise<Employee>;

  update(
    employee: Employee,
    dto: UpdateEmployeeDto,
    store: Store,
  ): Promise<Employee>;

  recover(employee: Employee): Promise<Employee>;

  remove(employee: Employee): Promise<void>;

  validate(id: string): Promise<Employee>;
}
