import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { ProductPhoto } from '../product-photos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories';
import { Store } from '../stores';
import { CategoryRepository } from '../categories/repositories/category.repository';
import { StoreRepository } from '../stores/repositories/store.repository';
import { ProductPhotosRepository } from '../product-photos/repositories/product-photos-repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPhoto, Category, Store])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    ProductPhotosRepository,
    CategoryRepository,
    StoreRepository,
  ],
  exports: [ProductRepository, ProductPhotosRepository],
})
export class ProductsModule {}
