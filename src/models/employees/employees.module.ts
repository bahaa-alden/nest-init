import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Role } from '../roles';
import { CaslModule } from '../../shared/casl';
import { Store } from '../stores';
import { JwtTokenModule } from '../../shared/jwt';
import { EmployeeImage } from './entities/employee-image.entity';
import { CloudinaryModule } from '../../shared/cloudinary';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Role, Store, EmployeeImage]),
    CaslModule,
    JwtTokenModule,
    CloudinaryModule,
    StoresModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
