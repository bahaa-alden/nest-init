import { Module } from '@nestjs/common';
import { ProductPhotosService } from './services/product-photos.service';
import {
  GenericProductPhotosController,
  ProductPhotosController,
} from './controllers/product-photos.controller';

@Module({
  controllers: [ProductPhotosController, GenericProductPhotosController],
  providers: [ProductPhotosService],
})
export class ProductPhotosModule {}
