import { Module, Provider } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CategoryRepository } from './repositories/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CATEGORY_TYPES } from './interfaces/type';

export const CategoriesServiceProvider: Provider = {
  provide: CATEGORY_TYPES.service,
  useClass: CategoriesService,
};
export const CategoryRepositoryProvider: Provider = {
  provide: CATEGORY_TYPES.repository,
  useClass: CategoryRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesServiceProvider, CategoryRepositoryProvider],
  exports: [CategoriesServiceProvider, CategoryRepositoryProvider],
})
export class CategoriesModule {}
