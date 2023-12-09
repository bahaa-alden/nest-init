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

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly categoryRepository: CategoryRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async findAll(page: number, limit: number): Promise<Product[]> {
    const skip = ((page - 1) * limit) | 0;
    const take = limit | 100;
    return this.productRepository.findAll(skip, take);
  }

  async findOne(id: string): Promise<Product> {
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
    const product = await this.findOne(id); // Check if the product exists

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
    return this.findOne(id); // Return the updated product
  }

  async remove(id: string, user: User): Promise<void> {
    const product = await this.findOne(id); // Check if the product exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, product);
    await product.softRemove();
  }
}
