import { Module } from '@nestjs/common';
import { EmployeesService } from './services';
import { EmployeesController } from './controllers';
import { StoresModule } from '../stores/stores.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
