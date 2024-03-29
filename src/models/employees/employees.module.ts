import { Module, Provider } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { Employee } from './entities/employee.entity';
import { EmployeePhoto } from './entities/employee-photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles';
import { Store } from '../stores';
import { EmployeePhotosRepository } from './repositories/employee-photos.repository';
import { EmployeeRepository } from './repositories/employee.repository';
import { EMPLOYEE_TYPES } from './interfaces/type';
import { StoreRepositoryProvider } from '../stores/stores.module';
import { RoleRepositoryProvider } from '../roles/roles.module';

export const EmployeesServiceProvider: Provider = {
  provide: EMPLOYEE_TYPES.service,
  useClass: EmployeesService,
};

export const EmployeeRepositoryProvider: Provider = {
  provide: EMPLOYEE_TYPES.repository.employee,
  useClass: EmployeeRepository,
};
export const EmployeePhotosRepositoryProvider: Provider = {
  provide: EMPLOYEE_TYPES.repository.employee_photos,
  useClass: EmployeePhotosRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([Employee, EmployeePhoto, Role, Store])],
  controllers: [EmployeesController],
  providers: [
    EmployeePhotosRepositoryProvider,
    EmployeeRepositoryProvider,
    EmployeesServiceProvider,
    RoleRepositoryProvider,
    StoreRepositoryProvider,
  ],
  exports: [
    EmployeePhotosRepositoryProvider,
    EmployeeRepositoryProvider,
    EmployeesServiceProvider,
  ],
})
export class EmployeesModule {}
