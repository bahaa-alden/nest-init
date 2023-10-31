import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesController } from './controllers';
import { StoresModule } from '../stores/stores.module';
import { EmployeeRepository } from './repositories/employee.repository';
import { EmployeeImagesRepository } from './repositories/employee-images.repository';

@Module({
  imports: [StoresModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeRepository, EmployeeImagesRepository],
})
export class EmployeesModule {}
