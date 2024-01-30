import { Module, Provider } from '@nestjs/common';
import { StoresService } from './services/stores.service';
import { StoresController } from './controllers/stores.controller';
import { StoreRepository } from './repositories/store.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { City } from '../cities';
import { CityRepositoryProvider } from '../cities/cities.module';
import { STORE_TYPES } from './interfaces/type';

export const StoresServiceProvider: Provider = {
  provide: STORE_TYPES.service,
  useClass: StoresService,
};

export const StoreRepositoryProvider: Provider = {
  provide: STORE_TYPES.repository,
  useClass: StoreRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([Store, City])],
  controllers: [StoresController],
  providers: [
    StoresServiceProvider,
    StoreRepositoryProvider,
    CityRepositoryProvider,
  ],
  exports: [StoresServiceProvider, StoreRepositoryProvider],
})
export class StoresModule {}
