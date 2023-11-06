import { Global, Module } from '@nestjs/common';
import { UserImagesRepository } from './user/user-images.repository';
import { UserRepository } from './user/user.repository';
import { AdminRepository } from './admin/admin.repository';
import { AdminImagesRepository } from './admin/admin-images.repository';
import { EmployeeRepository } from './employee/employee.repository';
import { EmployeeImagesRepository } from './employee/employee-images.repository';
import { CategoryRepository } from './category/category.repository';
import { CityRepository } from './city/city.repository';
import { StoreRepository } from './store/store.repository';
import { RoleRepository } from './role/role.repository';
import { PermissionRepository } from './permission/permission.repository';

@Global()
@Module({
  providers: [
    UserImagesRepository,
    UserRepository,
    AdminRepository,
    AdminImagesRepository,
    EmployeeRepository,
    EmployeeImagesRepository,
    CategoryRepository,
    CityRepository,
    StoreRepository,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [
    UserImagesRepository,
    UserRepository,
    AdminRepository,
    AdminImagesRepository,
    EmployeeRepository,
    EmployeeImagesRepository,
    CategoryRepository,
    CityRepository,
    StoreRepository,
    RoleRepository,
    PermissionRepository,
  ],
})
export class RepositoriesModule {}
