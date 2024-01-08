import { Module } from '@nestjs/common';
import { ProductPhotosService } from './services/product-photos.service';
import {
  GenericProductPhotosController,
  ProductPhotosController,
} from './controllers/product-photos.controller';
import { ProductPhotosRepository } from './repositories/product-photos-repository';
import { ProductRepository } from '../products/repositories';

@Module({
  controllers: [ProductPhotosController, GenericProductPhotosController],
  providers: [ProductPhotosService, ProductPhotosRepository, ProductRepository],
  exports: [ProductPhotosRepository],
})
export class ProductPhotosModule {}
