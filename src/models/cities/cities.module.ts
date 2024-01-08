import { Module } from '@nestjs/common';
import { CitiesService } from './services';
import { CitiesController } from './controllers';
import { CityRepository } from './repositories';

@Module({
  imports: [],
  controllers: [CitiesController],
  providers: [CitiesService, CityRepository],
  exports: [CitiesService, CityRepository],
})
export class CitiesModule {}
