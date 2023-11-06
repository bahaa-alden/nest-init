import { Module } from '@nestjs/common';
import { AdminsController } from './controllers';
import { AdminsService } from './services';

@Module({
  imports: [],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [],
})
export class AdminsModule {}
