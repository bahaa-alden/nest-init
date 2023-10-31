import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async createOne(dto: CreateCategoryDto) {
    const category = this.create(dto);
    await this.insert(category);
    return category;
  }

  async findById(id: string, withDeleted = false, relations = []) {
    return this.findOne({
      where: { id },
      withDeleted,
      relations,
    });
  }

  async updateOne(category: Category, dto: UpdateCategoryDto) {
    Object.assign<Category, UpdateCategoryDto>(category, dto);
    await category.save();
    return this.findById(category.id);
  }
}
