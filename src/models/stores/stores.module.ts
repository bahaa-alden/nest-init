import { Module } from '@nestjs/common';
import { StoresService } from './services';
import { StoresController } from './controllers';
import { CitiesModule } from '../cities/cities.module';
import { StoreRepository } from './repositories/';

@Module({
  imports: [CitiesModule],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository],
  exports: [StoresService, StoreRepository],
})
export class StoresModule {}
