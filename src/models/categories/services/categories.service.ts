import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryRepository } from '../repositories';
import { ICrud } from '../../../common/interfaces';
import { Category } from '../entities/category.entity';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';

@Injectable()
export class CategoriesService implements ICrud<Category> {
  constructor(private categoryRepository: CategoryRepository) {}
  async create(dto: CreateCategoryDto) {
    const category = await this.categoryRepository.createOne(dto);
    return category;
  }

  async get(ids?: string[]) {
    const categories = await this.categoryRepository.findAll(ids);

    if (ids && ids.length !== categories.length)
      throw new NotFoundException('some of categories not found');

    return categories;
  }

  async getOne(id: string, withDeleted?: boolean, relations?: string[]) {
    const category = await this.categoryRepository.findById(
      id,
      withDeleted,
      relations,
    );
    if (!category)
      throw new NotFoundException(item_not_found(Entities.Category));
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.getOne(id);
    return this.categoryRepository.updateOne(category, dto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findCategoryWithProducts(id);
    if (!category)
      throw new NotFoundException(item_not_found(Entities.Category));
    await category.softRemove();
    return;
  }

  async recover(id: string) {
    const category = await this.categoryRepository.findCategoryWithProducts(
      id,
      true,
    );
    return category.recover();
  }
}
