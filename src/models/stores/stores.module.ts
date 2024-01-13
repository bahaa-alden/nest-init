import { Module } from '@nestjs/common';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/stores.controller';
import { StoreRepository } from './repositories/store.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { City } from '../cities';
import { CityRepositoryProvider } from '../cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store, City])],
  controllers: [StoresController],
  providers: [StoresService, StoreRepository, CityRepositoryProvider],
  exports: [StoresService, StoreRepository],
})
export class StoresModule {}
