import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './../../../models/categories';

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

  async findCategoryProducts(id: string, withDeleted = false) {
    return this.findOne({
      where: { id, products: { is_paid: false } },
      withDeleted,
      relations: { products: true },
    });
  }

  async updateOne(category: Category, dto: UpdateCategoryDto) {
    Object.assign<Category, UpdateCategoryDto>(category, dto);
    await category.save();
    return this.findById(category.id);
  }
}
