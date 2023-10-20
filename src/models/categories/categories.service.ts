import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    await category.save();
    return category;
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    const category = this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    await category.save();
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    return this.categoryRepository.softRemove(category);
  }

  async recover(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    return this.categoryRepository.recover(category);
  }
}
