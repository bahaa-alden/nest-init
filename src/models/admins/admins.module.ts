import { Module } from '@nestjs/common';
import { AdminsController } from './controllers';
import { AdminsService } from './services';
import { AdminRepository } from './repositories/admin.repository';
import { AdminImagesRepository } from './repositories/admin-images.repository';

@Module({
  imports: [],
  controllers: [AdminsController],
  providers: [AdminsService, AdminRepository, AdminImagesRepository],
  exports: [AdminImagesRepository, AdminRepository],
})
export class AdminsModule {}
