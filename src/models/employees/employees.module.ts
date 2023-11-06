import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesController } from './controllers';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [StoresModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
