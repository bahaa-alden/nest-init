// owner.middleware.ts

import {
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { item_not_found } from '../constants';
import { Entities } from '../enums';
import { RedisStoreService } from '../../shared/redis-store/redis-store.service';
import { IProductRepository } from '../../models/products/interfaces/repositories/product.repository.interface';
import { PRODUCT_TYPES } from '../../models/products/interfaces/type';

@Injectable()
export class OwnerMiddleware implements NestMiddleware {
  constructor(
    @Inject(PRODUCT_TYPES.repository)
    private productRepository: IProductRepository,
    private redisStoreService: RedisStoreService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Fetch the product by ID
      const product = await this.productRepository.findOneByIdForThings(id);
      const userId = await this.redisStoreService.getStoredUserId();
      // Check if the user is the owner of the product
      if (product && product.user && product.user.id === userId) {
        // User is the owner, set the result in the request
        req.query.isOwner = 'true';
      } else {
        // User is not the owner
        req.query.isOwner = 'false';
      }
      // Continue with the request
      next();
    } catch (error) {
      // Handle errors, e.g., product not found
      throw new NotFoundException(item_not_found(Entities.Product));
    }
  }
}
