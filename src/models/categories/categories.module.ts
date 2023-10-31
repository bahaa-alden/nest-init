import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers';
import { CategoriesService } from './services';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
})
export class CategoriesModule {}
