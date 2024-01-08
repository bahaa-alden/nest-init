import { Module } from '@nestjs/common';
import { ProductsService } from './services';
import { ProductsController } from './controllers';
import { ProductPhotosRepository, ProductRepository } from './repositories';
import { CategoryRepository } from '../categories/repositories';
import { StoreRepository } from '../stores/repositories';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    ProductPhotosRepository,
    CategoryRepository,
    StoreRepository,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
