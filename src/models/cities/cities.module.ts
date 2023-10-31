import { Module } from '@nestjs/common';
import { CitiesService } from './services';
import { CitiesController } from './controllers';
import { CityRepository } from './repositories/city.repository';

@Module({
  imports: [],
  controllers: [CitiesController],
  providers: [CitiesService, CityRepository],
  exports: [CitiesService],
})
export class CitiesModule {}
