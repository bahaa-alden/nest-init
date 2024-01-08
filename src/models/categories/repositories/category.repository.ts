import { Injectable } from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../models/categories';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async findAll(ids?: string[]) {
    let categories = this.createQueryBuilder('category');
    categories = ids ? categories.andWhereInIds(ids) : categories;

    return categories.getMany();
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

  async findCategoryWithProducts(id: string, withDeleted = false) {
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
