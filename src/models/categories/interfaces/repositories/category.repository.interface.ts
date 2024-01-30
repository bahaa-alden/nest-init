import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';
import { Category } from '../../entities/category.entity';

export interface ICategoryRepository {
  find(ids?: string[]): Promise<Category[]>;

  create(dto: CreateCategoryDto): Promise<Category>;

  findOneById(
    id: string,
    withDeleted?: boolean,
    relations?: string[],
  ): Promise<Category>;

  findCategoryWithProducts(
    id: string,
    withDeleted?: boolean,
  ): Promise<Category>;

  update(category: Category, dto: UpdateCategoryDto): Promise<Category>;

  recover(category: Category): Promise<Category>;

  remove(category: Category): Promise<void>;
}
