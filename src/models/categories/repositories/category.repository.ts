import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../interfaces/repositories/category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async find(ids?: string[]) {
    const categories = this.categoryRepository.createQueryBuilder('category');
    if (ids) categories.andWhereInIds(ids);

    return categories.getMany();
  }

  async create(dto: CreateCategoryDto) {
    const category = this.create(dto);
    await this.categoryRepository.insert(category);
    return category;
  }

  async findOneById(id: string, withDeleted = false, relations = []) {
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
    return this.findOneById(category.id);
  }

  async recover(category: Category): Promise<Category> {
    await this.categoryRepository.recover(category);
    return this.findOneById(category.id);
  }

  async remove(category: Category): Promise<void> {
    await this.categoryRepository.softRemove(category);
  }
}
