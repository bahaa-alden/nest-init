import { Module } from '@nestjs/common';
import { ProductPhotosService } from './services/product-photos.service';
import {
  GenericProductPhotosController,
  ProductPhotosController,
} from './controllers/product-photos.controller';
import { ProductPhotosRepository } from './repositories/product-photos-repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { ProductPhoto } from './entities/product-photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPhoto, Product])],
  controllers: [ProductPhotosController, GenericProductPhotosController],
  providers: [ProductPhotosService, ProductPhotosRepository, ProductRepository],
  exports: [ProductPhotosRepository],
})
export class ProductPhotosModule {}
