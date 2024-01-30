import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';
import { Category } from '../../entities/category.entity';

export interface ICategoriesService {
  create(dto: CreateCategoryDto): Promise<Category>;

  find(ids?: string[]): Promise<Category[]>;

  findOne(
    id: string,
    withDeleted?: boolean,
    relations?: string[],
  ): Promise<Category>;

  update(id: string, dto: UpdateCategoryDto): Promise<Category>;

  recover(id: string): Promise<Category>;

  remove(id: string): Promise<void>;
}
