import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesAuthController, EmployeesController } from './controllers';

@Module({
  imports: [],
  controllers: [EmployeesAuthController, EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
