import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../models/users';
import { Category } from '../../../models/categories';
import { Store } from '../../../models/stores';
import { ProductPhoto } from '../../../models/product-photos';
import { PaginatedResponse } from '../../../common/types';
import { RedisStoreService } from '../../../shared/redis-store';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../entities/product.entity';
import { pagination } from '../../../common/helpers';
import { IProductRepository } from '../interfaces/repositories/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly redisStoreService: RedisStoreService,
  ) {}

  /**
   * Find products based on various criteria, including pagination, search query, and user preferences.
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @param is_paid - Flag indicating whether the product is paid or not.
   * @param q - The search query for product titles, content, city names, category names, or store names.
   * @param user - The user object representing the current user.
   * @returns A paginated response containing products that match the criteria.
   */
  async find(
    page: number,
    limit: number,
    is_paid: boolean,
    q: string,
    user: User,
  ): Promise<PaginatedResponse<Product> | Product[]> {
    // Calculate skip and take values for pagination
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    // Extract favorite category and city IDs from the user object
    const favcat = user.favoriteCategories.map((e) => e.id) || [];
    const favcit = user.favoriteCities.map((e) => e.id) || [];
    // Create a query builder for the 'product' entity
    const qb = this.productRepo.createQueryBuilder('product');

    // Match stage - Select specific fields for the response
    qb.distinct().select([
      'product.id',
      'product.title',
      'product.content',
      'product.price',
      'product.createdAt',
      'product.updatedAt',
      'photos.id',
      'photos.webUrl',
      'photos.mobileUrl',
      'photos.profileUrl',
      'photos.blurHash',
      'user.id',
      'user.name',
      'user_photos.id',
      'user_photos.webUrl',
      'user_photos.mobileUrl',
      'user_photos.profileUrl',
      'user_photos.blurHash',
      'coupons.id',
      'coupons.discount',
      'coupons.expire',
      'coupons_user.id',
      'coupons_user.name',
      'coupons_user_photos.id',
      'coupons_user_photos.webUrl',
      'coupons_user_photos.mobileUrl',
      'coupons_user_photos.profileUrl',
      'coupons_user_photos.blurHash',
      'category.id',
      'category.name',
      'store.id',
      'store.name',
      'city.id',
      'city.name',
      'likedby.id',
      'comments.id',
      "DATE_TRUNC('day', product.createdAt) AS truncatedDate",
    ]);

    // Lookup stages - Left join with other entities
    qb.leftJoin('product.category', 'category')
      .leftJoin(
        'product.coupons',
        'coupons',
        'coupons.userId = :userId AND coupons.active = true',
        {
          userId: user.id,
        },
      )
      .leftJoin('product.user', 'user')
      .leftJoin('product.store', 'store')
      .leftJoin('product.likedBy', 'likedby')
      .leftJoin('product.photos', 'photos')
      .leftJoin('product._comments', 'comments')
      .leftJoin('user.photos', 'user_photos')
      .leftJoin('coupons.user', 'coupons_user')
      .leftJoin('coupons_user.photos', 'coupons_user_photos')
      .leftJoin('store.city', 'city');

    // Filter products based on 'is_paid' and text search
    qb.where('product.is_paid = :is_paid', { is_paid });
    if (q) {
      qb.andWhere(
        '(product.title ILIKE :search OR product.content ILIKE :search ' +
          'OR city.name ILIKE :search OR category.name ILIKE :search OR store.name ILIKE :search)',
        { search: `%${q}%` },
      );
    }

    //pagination
    qb.offset(skip).limit(take);

    qb.orderBy('truncatedDate', 'DESC');
    // Apply sorting based on user preferences
    if (favcat.length && favcit.length) {
      qb.addSelect([
        'CASE ' +
          'WHEN category.id IN (:...favoriteCategories) AND city.id IN (:...favoriteCities) THEN 0 ' +
          'WHEN (category.id IN (:...favoriteCategories) OR city.id IN (:...favoriteCities)) THEN 1 ' +
          'ELSE 2 ' +
          'END AS sortField',
      ]);
      qb.setParameter('favoriteCategories', favcat).setParameter(
        'favoriteCities',
        favcit,
      );
      qb.addOrderBy('sortField', 'ASC');
    } else if (favcat.length) {
      qb.addSelect([
        'CASE ' +
          'WHEN category.id IN (:...favoriteCategories) THEN 1' +
          'ELSE 2 ' +
          'END AS sortField',
      ]);
      qb.setParameter('favoriteCategories', favcat);
      qb.addOrderBy('sortField', 'ASC');
    } else if (favcit.length) {
      qb.addSelect([
        'CASE ' +
          'WHEN city.id IN (:...favoriteCities) THEN 1' +
          'ELSE 2 ' +
          'END AS sortField',
      ]);
      qb.setParameter('favoriteCities', favcit);
      qb.addOrderBy('sortField', 'ASC');
    }
    // AddFields stage with $switch for sorting
    qb.addOrderBy('product.updatedAt', 'DESC');

    // Execute the query
    // eslint-disable-next-line prefer-const
    let [results, totalDataCount] = await qb.getManyAndCount();
    results = await this.likedByMe(...results);

    return pagination(page, limit, totalDataCount, results);
  }

  /**
   * Find a single product by ID with detailed information.
   * @param id - The ID of the product to retrieve.
   * @returns The product with detailed information.
   */
  async findOneById(
    id: string,
    user?: User,
    isOwner?: boolean,
  ): Promise<Product> {
    // Create a query builder instance for the "product" entity
    const qb = this.productRepo.createQueryBuilder('product');
    // Build the query for selecting specific fields and including relations
    qb.select([
      'product.id',
      'product.createdAt',
      'product.updatedAt',
      'product.title',
      'product.content',
      'product.price',
      'product.is_paid',
      'product.userId',
      'user.id',
      'user.name',
      'user_photos.id',
      'user_photos.webUrl',
      'user_photos.mobileUrl',
      'user_photos.profileUrl',
      'user_photos.blurHash',
      'category.id',
      'category.name',
      'store.id',
      'store.name',
      'city.id',
      'city.name',
      'photos.id',
      'photos.webUrl',
      'photos.mobileUrl',
      'photos.profileUrl',
      'photos.blurHash',
      'comments.id',
      'likedby.id',
    ]);

    // Include relations in the query
    qb.leftJoin('product.category', 'category')
      .leftJoin('product.store', 'store')
      .leftJoin('store.city', 'city')
      .leftJoin('product.user', 'user')
      .leftJoin('user.photos', 'user_photos')
      .leftJoin('product._comments', 'comments');
    if (user) {
      !isOwner
        ? qb.leftJoin(
            'product.coupons',
            'coupons',
            'coupons.userId = :userId AND coupons.active = true',
            {
              userId: user.id,
            },
          )
        : qb.leftJoin('product.coupons', 'coupons');

      qb.leftJoin('coupons.user', 'coupons_user').leftJoin(
        'coupons_user.photos',
        'coupons_user_photos',
      );

      qb.addSelect([
        'coupons.id',
        'coupons.discount',
        'coupons.expire',
        'coupons_user.id',
        'coupons_user.name',
        'coupons_user_photos.id',
        'coupons_user_photos.webUrl',
        'coupons_user_photos.mobileUrl',
        'coupons_user_photos.profileUrl',
        'coupons_user_photos.blurHash',
      ]);
    }

    qb.leftJoin('product.photos', 'photos')
      .leftJoin('product.likedBy', 'likedby')

      .where('product.id = :id', { id });

    // Execute the query and get the product
    const product = await qb.getOne();

    // Check if the product is liked by any user
    const res = await this.likedByMe(product);

    // Return the first item in the result array (or null if the array is empty)
    return res[0];
  }

  async findOneByIdForThings(
    id: string,
    withDeleted = false,
  ): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, is_paid: false },
      select: {
        id: true,
        title: true,
        price: true,
        is_paid: true,
        user: { name: true, id: true },
        userId: true,
      },
      relations: {
        user: { photos: true },
        category: true,
        photos: true,
      },
      withDeleted,
    });
    return product;
  }

  async create(
    dto: CreateProductDto,
    user: User,
    category: Category,
    store: Store,
    photos: ProductPhoto[],
  ) {
    const product = this.productRepo.create({
      ...dto,
      user,
      category,
      store,
      photos,
    });

    await this.productRepo.save(product);
    return product;
  }

  async update(product: Product, dto: UpdateProductDto): Promise<Product> {
    product.store.id = dto.storeId;
    product.category.id = dto.categoryId;
    product.title = dto.title;
    product.content = dto.content;
    product.price = dto.price;
    await this.productRepo.save(product);
    return this.findOneById(product.id);
  }

  async recover(product: Product): Promise<Product> {
    await this.productRepo.recover(product);
    return product;
  }

  async remove(product: Product): Promise<void> {
    await this.productRepo.softRemove(product);
  }

  async updatePhotos(
    product: Product,
    photos: ProductPhoto[],
  ): Promise<Product> {
    product.photos.push(...photos);
    await this.productRepo.save(product);
    return await this.findOneById(product.id);
  }

  async like(product: Product, user: User): Promise<string> {
    product.likedBy.push(user);
    await this.productRepo.save(product);
    return 'OK';
  }

  async dislike(product: Product, user: User): Promise<string> {
    await this.productRepo
      .createQueryBuilder()
      .relation(Product, 'likedBy')
      .of(product) // you can use just post id as well
      .remove(user);
    return 'OK';
  }

  async likedByMe(...data: Product[]) {
    return Promise.all(
      data.map(async (e) => {
        const id = await this.redisStoreService.getStoredUserId();
        e.likedByMe = e.likedBy.find((u) => u.id === id) ? true : false;
        return e;
      }),
    );
  }
}
