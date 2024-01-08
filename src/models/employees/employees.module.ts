import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesController } from './controllers';
import { EmployeePhotosRepository, EmployeeRepository } from './repositories';
import { RoleRepository } from '../roles/repositories';
import { StoreRepository } from '../stores/repositories';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    EmployeeRepository,
    RoleRepository,
    StoreRepository,
    EmployeePhotosRepository,
  ],
  exports: [EmployeeRepository],
})
export class EmployeesModule {}
