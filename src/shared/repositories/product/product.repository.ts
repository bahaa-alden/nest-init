import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from '../../../models/products';
import { User } from '../../../models/users';
import { Category } from '../../../models/categories';
import { ProductPhotosRepository } from './product-photos-repository';
import { Store } from '../../../models/stores';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productPhotosRepository: ProductPhotosRepository,
  ) {
    super(Product, dataSource.createEntityManager());
  }

  async findAll(skip: number, take: number, is_paid = false) {
    return this.find({
      where: { is_paid },
      skip,
      take,
      relations: {
        user: true,
        store: { city: true },
        category: true,
        comments: true,
        coupons: true,
        photos: true,
      },
    });
  }
  async findById(id: string) {
    return this.findOne({
      where: { id },
      relations: {
        user: true,
        store: { city: true },
        category: true,
        comments: true,
        coupons: true,
        photos: true,
      },
    });
  }

  async createOne(
    dto: CreateProductDto,
    user: User,
    category: Category,
    store: Store,
  ) {
    const product = this.create({ ...dto, user, photos: [], category, store });
    product.photos = await this.productPhotosRepository.uploadPhotos(
      dto.photos,
    );
    await product.save();
    return product;
  }

  async updateOne(product: Product, dto: UpdateProductDto) {
    product.store.id = dto.storeId;
    product.category.id = dto.categoryId;
    product.title = dto.title;
    product.content = dto.content;
    product.price = dto.price;
    await product.save();
    return this.findById(product.id);
  }
}
