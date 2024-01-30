import { PaginatedResponse } from '../../../../common/types';
import { User } from '../../../users';
import { CreateProductDto, UpdateProductDto } from '../../dto';
import { Product } from '../../entities/product.entity';

export interface IProductsService {
  find(
    page: number,
    limit: number,
    is_paid: boolean,
    q: string,
    user: User,
  ): Promise<PaginatedResponse<Product> | Product[]>;

  findOne(id: string, user?: User, isOwner?: boolean): Promise<Product>;

  create(dto: CreateProductDto, user: User): Promise<Product>;

  update(id: string, dto: UpdateProductDto, user: User): Promise<Product>;

  like(id: string, user: User): Promise<string>;

  dislike(id: string, user: User): Promise<string>;

  recover(id: string): Promise<Product>;

  remove(id: string, user: User): Promise<void>;

  isProductOwner(productId: string, proOwner: User): Promise<Product>;
}
