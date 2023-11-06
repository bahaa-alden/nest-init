import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers';
import { CategoriesService } from './services';

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
