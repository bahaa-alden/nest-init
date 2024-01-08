import { Module } from '@nestjs/common';
import { AdminsController } from './controllers';
import { AdminsService } from './services';
import { AdminPhotosRepository, AdminRepository } from './repositories';
import { RoleRepository } from '../roles/repositories';

@Module({
  imports: [],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    AdminRepository,
    RoleRepository,
    AdminPhotosRepository,
  ],
  exports: [AdminRepository],
})
export class AdminsModule {}
