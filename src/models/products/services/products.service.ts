import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../../../shared/repositories/product';
import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { User } from '../../users';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../common/enums';
import { CategoryRepository } from '../../../shared/repositories/category';
import { StoreRepository } from '../../../shared/repositories/store';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';

@Injectable()
export class ProductsService implements ICrud<Product> {
  constructor(
    private readonly productRepository: ProductRepository,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly categoryRepository: CategoryRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async get(
    page: number,
    limit: number,
    is_paid: boolean,
  ): Promise<PaginatedResponse<Product>> {
    return this.productRepository.findAll(page, limit, is_paid);
  }

  async getOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }

  async create(dto: CreateProductDto, user: User): Promise<Product> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundException('category not found');
    const store = await this.storeRepository.findById(dto.storeId);
    if (!store) throw new NotFoundException('store not found');
    const product = this.productRepository.createOne(
      dto,
      user,
      category,
      store,
    );
    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.getOne(id); // Check if the product exists

    const ability = this.caslAbilityFactory.defineAbility(user);

    ForbiddenError.from(ability).throwUnlessCan(Action.Update, product);
    if (dto.storeId) {
      const store = await this.storeRepository.findById(dto.storeId);
      if (!store) throw new NotFoundException('store not found');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) throw new NotFoundException('category not found');
    }

    await this.productRepository.updateOne(product, dto);
    return this.getOne(id); // Return the updated product
  }

  async like(id: string, user: User) {
    const product = await this.getOne(id);
    return await this.productRepository.like(product, user);
  }

  async dislike(id: string, user: User) {
    const product = await this.getOne(id);
    return await this.productRepository.dislike(product, user);
  }

  async remove(id: string, user: User): Promise<void> {
    const product = await this.getOne(id); // Check if the product exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, product);
    await product.softRemove();
  }
}
