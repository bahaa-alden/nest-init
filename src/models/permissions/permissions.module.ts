import { Module } from '@nestjs/common';
import { PermissionsService } from './services';
import { PermissionsController } from './controllers';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
