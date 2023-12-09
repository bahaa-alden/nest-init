import { Global, Module } from '@nestjs/common';
import { AdminPhotosRepository, AdminRepository } from './admin';
import { EmployeePhotosRepository, EmployeeRepository } from './employee';
import { CategoryRepository } from './category';
import { CityRepository } from './city';
import { StoreRepository } from './store';
import { RoleRepository } from './role';
import { PermissionRepository } from './permission';
import { CommentsRepository } from './comment';
import { ProductPhotosRepository, ProductRepository } from './product';
import { UserPhotosRepository, UserRepository } from './user';

@Global()
@Module({
  providers: [
    UserPhotosRepository,
    UserRepository,
    AdminRepository,
    AdminPhotosRepository,
    EmployeeRepository,
    EmployeePhotosRepository,
    CategoryRepository,
    CityRepository,
    StoreRepository,
    RoleRepository,
    PermissionRepository,
    CommentsRepository,
    ProductRepository,
    ProductPhotosRepository,
  ],
  exports: [
    UserPhotosRepository,
    UserRepository,
    AdminRepository,
    AdminPhotosRepository,
    EmployeeRepository,
    EmployeePhotosRepository,
    CategoryRepository,
    CityRepository,
    StoreRepository,
    RoleRepository,
    PermissionRepository,
    CommentsRepository,
    ProductRepository,
    ProductPhotosRepository,
  ],
})
export class RepositoriesModule {}
