import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesController } from './controllers';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
