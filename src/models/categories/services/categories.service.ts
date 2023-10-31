import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoryRepository) {}
  async create(dto: CreateCategoryDto) {
    const category = await this.categoryRepository.createOne(dto);
    return category;
  }

  async findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: string, withDeleted?: boolean, relations?: string[]) {
    const category = await this.categoryRepository.findById(
      id,
      withDeleted,
      relations,
    );
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return this.categoryRepository.updateOne(category, dto);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    return category.softRemove();
  }

  async recover(id: string) {
    const category = await this.findOne(id, true);
    return category.recover();
  }
}