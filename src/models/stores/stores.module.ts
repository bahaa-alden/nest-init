import { Module } from '@nestjs/common';
import { StoresService } from './services';
import { StoresController } from './controllers';
import { CitiesModule } from '../cities/cities.module';
import { StoreRepository } from '../../shared/repositories/store';

@Module({
  imports: [CitiesModule],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository],
  exports: [StoresService],
})
export class StoresModule {}
