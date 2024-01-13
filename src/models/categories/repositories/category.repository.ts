import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async find(ids?: string[]) {
    let categories = this.categoryRepository.createQueryBuilder('category');
    categories = ids ? categories.andWhereInIds(ids) : categories;

    return categories.getMany();
  }

  async create(dto: CreateCategoryDto) {
    const category = this.create(dto);
    await this.categoryRepository.insert(category);
    return category;
  }

  async findOne(id: string, withDeleted = false, relations = []) {
    return this.categoryRepository.findOne({
      where: { id },
      withDeleted,
      relations,
    });
  }

  async findCategoryWithProducts(id: string, withDeleted = false) {
    return this.categoryRepository.findOne({
      where: { id, products: { is_paid: false } },
      withDeleted,
      relations: { products: true },
    });
  }

  async update(category: Category, dto: UpdateCategoryDto) {
    Object.assign<Category, UpdateCategoryDto>(category, dto);
    await this.categoryRepository.save(category);
    return this.findOne(category.id);
  }
}
