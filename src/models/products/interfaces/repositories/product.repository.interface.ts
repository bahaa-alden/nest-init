import { PaginatedResponse } from '../../../../common/types';
import { Category } from '../../../categories';
import { ProductPhoto } from '../../../product-photos';
import { Store } from '../../../stores';
import { User } from '../../../users';
import { CreateProductDto, UpdateProductDto } from '../../dto';
import { Product } from '../../entities/product.entity';

export interface IProductRepository {
  find(
    page: number,
    limit: number,
    is_paid: boolean,
    q: string,
    user: User,
  ): Promise<PaginatedResponse<Product> | Product[]>;
  /**
   * Find a single product by ID with detailed information.
   * @param id - The ID of the product to retrieve.
   * @returns The product with detailed information.
   */
  findOneById(id: string, user?: User, isOwner?: boolean): Promise<Product>;

  findOneByIdForThings(id: string, withDeleted?: boolean): Promise<Product>;

  create(
    dto: CreateProductDto,
    user: User,
    category: Category,
    store: Store,
    photos: ProductPhoto[],
  ): Promise<Product>;

  update(product: Product, dto: UpdateProductDto): Promise<Product>;

  recover(product: Product): Promise<Product>;

  remove(product: Product): Promise<void>;

  updatePhotos(product: Product, photos: ProductPhoto[]): Promise<Product>;

  like(product: Product, user: User): Promise<string>;

  dislike(product: Product, user: User): Promise<string>;
}
