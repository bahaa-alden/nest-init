import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { ICategoriesService } from '../interfaces/services/categories.service.interface';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../interfaces/repositories/category.repository.interface';
import { CATEGORY_TYPES } from '../interfaces/type';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(
    @Inject(CATEGORY_TYPES.repository)
    private categoryRepository: ICategoryRepository,
  ) {}
  async create(dto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(dto);
    return category;
  }

  async find(ids?: string[]): Promise<Category[]> {
    const categories = await this.categoryRepository.find(ids);

    if (ids && ids.length !== categories.length)
      throw new NotFoundException('some of categories not found');

    return categories;
  }

  async findOne(
    id: string,
    withDeleted?: boolean,
    relations?: string[],
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneById(
      id,
      withDeleted,
      relations,
    );
    if (!category)
      throw new NotFoundException(item_not_found(Entities.Category));
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    return this.categoryRepository.update(category, dto);
  }

  async recover(id: string): Promise<Category> {
    const category = await this.categoryRepository.findCategoryWithProducts(
      id,
      true,
    );
    return this.categoryRepository.recover(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryWithProducts(id);
    if (!category)
      throw new NotFoundException(item_not_found(Entities.Category));
    await this.categoryRepository.remove(category);
  }
}
