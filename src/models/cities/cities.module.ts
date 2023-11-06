import { Module } from '@nestjs/common';
import { CitiesService } from './services';
import { CitiesController } from './controllers';

@Module({
  imports: [],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
