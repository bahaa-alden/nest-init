import {
  MiddlewareConsumer,
  Module,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductPhoto } from '../product-photos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories';
import { Store } from '../stores';
import { ProductPhotosRepository } from '../product-photos/repositories/product-photos-repository';
import { ProductRepository } from './repositories/product.repository';
import { OwnerMiddleware } from '../../common/middlewares';
import { PRODUCT_TYPES } from './interfaces/type';
import { CategoryRepositoryProvider } from '../categories/categories.module';
import { StoreRepositoryProvider } from '../stores/stores.module';

export const ProductsServiceProvider: Provider = {
  provide: PRODUCT_TYPES.service,
  useClass: ProductsService,
};

export const ProductRepositoryProvider: Provider = {
  provide: PRODUCT_TYPES.repository,
  useClass: ProductRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPhoto, Category, Store])],
  controllers: [ProductsController],
  providers: [
    ProductsServiceProvider,
    ProductRepositoryProvider,
    ProductPhotosRepository,
    CategoryRepositoryProvider,
    StoreRepositoryProvider,
  ],
  exports: [
    ProductsServiceProvider,
    ProductRepositoryProvider,
    ProductPhotosRepository,
  ],
})
export class ProductsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OwnerMiddleware).forRoutes({
      path: 'products/:id',
      method: RequestMethod.GET,
      version: '1',
    });
  }
}
