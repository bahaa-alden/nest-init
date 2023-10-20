import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { CaslModule } from '../../shared/casl';
import { City } from '../cities';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), CaslModule, CitiesModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
