import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { User } from '../../users';
import { ForbiddenError } from '@casl/ability';
import { Action, Entities } from '../../../common/enums';
import { PaginatedResponse } from '../../../common/types';
import { denied_error, item_not_found } from '../../../common/constants';
import { IProductRepository } from '../interfaces/repositories/product.repository.interface';
import { PRODUCT_TYPES } from '../interfaces/type';
import { ICategoryRepository } from '../../categories/interfaces/repositories/category.repository.interface';
import { CATEGORY_TYPES } from '../../categories/interfaces/type';
import { STORE_TYPES } from '../../stores/interfaces/type';
import { IStoreRepository } from '../../stores/interfaces/repositories/store.repository.interface';
import { IProductsService } from '../interfaces/services/products.service.interface';
import { ProductPhotosRepository } from '../../product-photos/repositories/product-photos-repository';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @Inject(PRODUCT_TYPES.repository)
    private readonly productRepository: IProductRepository,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(CATEGORY_TYPES.repository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(STORE_TYPES.repository)
    private readonly storeRepository: IStoreRepository,
    private productPhotosRepository: ProductPhotosRepository,
  ) {}

  async find(
    page: number,
    limit: number,
    is_paid: boolean,
    q: string,
    user: User,
  ): Promise<PaginatedResponse<Product> | Product[]> {
    return this.productRepository.find(page, limit, is_paid, q, user);
  }

  async findOne(id: string, user?: User, isOwner?: boolean): Promise<Product> {
    const product = await this.productRepository.findOneById(id, user, isOwner);
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));

    return product;
  }

  async create(dto: CreateProductDto, user: User): Promise<Product> {
    const category = await this.categoryRepository.findOneById(dto.categoryId);
    if (!category)
      throw new NotFoundException(item_not_found(Entities.Category));
    const store = await this.storeRepository.findOneById(dto.storeId);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    const photos = await this.productPhotosRepository.uploadPhotos(dto.photos);
    const product = await this.productRepository.create(
      dto,
      user,
      category,
      store,
      photos,
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
      const store = await this.storeRepository.findOneById(dto.storeId);
      if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOneById(
        dto.categoryId,
      );
      if (!category)
        throw new NotFoundException(item_not_found(Entities.Category));
    }

    return this.productRepository.update(product, dto);
  }

  async like(id: string, user: User): Promise<string> {
    const product = await this.findOne(id);
    return await this.productRepository.like(product, user);
  }

  async dislike(id: string, user: User): Promise<string> {
    const product = await this.findOne(id);
    return await this.productRepository.dislike(product, user);
  }

  async recover(id: string): Promise<Product> {
    // Check if the product exists
    const product = await this.productRepository.findOneByIdForThings(id, true);
    if (product) throw new NotFoundException(item_not_found(Entities.Product));
    return this.productRepository.recover(product);
  }

  async remove(id: string, user: User): Promise<void> {
    const product = await this.findOne(id); // Check if the product exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, product);
    await this.productRepository.remove(product);
  }

  async isProductOwner(productId: string, proOwner: User) {
    const product = await this.productRepository.findOneByIdForThings(
      productId,
    );
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));

    if (product.user.id !== proOwner.id)
      throw new ForbiddenException(denied_error);
    return product;
  }
}
