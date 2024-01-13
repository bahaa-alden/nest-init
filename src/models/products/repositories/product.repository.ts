import { Injectable } from '@nestjs/common';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { User } from '../../../models/users';
import { Category } from '../../../models/categories';
import { ProductPhotosRepository } from '../../product-photos/repositories/product-photos-repository';
import { Store } from '../../../models/stores';
import { CreateProductPhotoDto } from '../../../models/product-photos/dto/create-product-photo.dto';
import { ProductPhoto } from '../../../models/product-photos';
import { PaginatedResponse } from '../../../common/types';
import { pagination } from '../../../common/helpers';
import { RedisStoreService } from '../../../shared/redis-store';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productPhotosRepository: ProductPhotosRepository,
    private readonly redisStoreService: RedisStoreService,
  ) {}

  async find(
    page: number,
    limit: number,
    is_paid = false,
  ): Promise<PaginatedResponse<Product>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    let data = await this.productRepository.find({
      where: { is_paid },
      skip,
      take,
      relations: {
        store: { city: true },
        category: true,
        _comments: true,
        coupons: true,
        photos: true,
      },
    });
    const totalDataCount = await this.productRepository.count({
      where: { is_paid },
    });
    data = await Promise.all(this.likedByMe(...data));
    return pagination(page, limit, totalDataCount, data);
  }
  async findOne(id: string, options?: FindOptionsWhere<Product>) {
    let product = await this.productRepository.findOne({
      where: { id, ...options },
      relations: {
        user: true,
        store: { city: true },
        category: true,
        _comments: true,
        coupons: true,
        photos: true,
      },
    });
    product = await Promise.all(this.likedByMe(product))[0];
    return product;
  }

  async findByIdForThings(id: string, options?: FindOptionsWhere<Product>) {
    let product = await this.productRepository.findOne({
      where: { id, ...options, is_paid: false },
      select: {
        id: true,
        title: true,
        price: true,
        is_paid: true,
        user: { name: true, id: true },
      },
      relations: {
        user: { photos: true },
        category: true,
        photos: true,
      },
    });
    product = await Promise.all(this.likedByMe(product))[0];
    return product;
  }

  async create(
    dto: CreateProductDto,
    user: User,
    category: Category,
    store: Store,
  ) {
    const product = this.productRepository.create({
      ...dto,
      user,
      photos: [],
      category,
      store,
    });
    product.photos = await this.productPhotosRepository.uploadPhotos(
      dto.photos,
    );
    await product.save();
    return product;
  }

  async update(product: Product, dto: UpdateProductDto) {
    product.store.id = dto.storeId;
    product.category.id = dto.categoryId;
    product.title = dto.title;
    product.content = dto.content;
    product.price = dto.price;
    await product.save();
    return this.findOne(product.id);
  }

  async updatePhotos(productId: string, dto: CreateProductPhotoDto) {
    await this.productPhotosRepository.uploadPhotos(dto.photos);
    return await this.findOne(productId);
  }
  async removePhoto(photo: ProductPhoto) {
    await this.productPhotosRepository.remove(photo);
    await this.findOne(photo.productId);
  }

  async like(product: Product, user: User) {
    product.likedBy.push(user);
    await this.productRepository.save(product);
    return 'OK';
  }

  async dislike(product: Product, user: User) {
    await this.productRepository
      .createQueryBuilder()
      .relation(Product, 'likedBy')
      .of(product) // you can use just post id as well
      .remove(user);
    return 'OK';
  }

  likedByMe(...data: Product[]) {
    return data.map(async (e) => {
      const id = await this.redisStoreService.getStoredUserId();
      e.likedByMe = e.likedBy.find((u) => u.id === id) ? true : false;
      return e;
    });
  }
}
