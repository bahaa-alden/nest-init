import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers';
import { CategoriesService } from './services';
import { CategoryRepository } from './repositories';

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
  exports: [CategoriesService, CategoryRepository],
})
export class CategoriesModule {}
