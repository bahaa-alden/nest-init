import { Module } from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import {
  GenericProductPhotosController,
  ProductPhotosController,
} from './product-photos.controller';

@Module({
  controllers: [ProductPhotosController, GenericProductPhotosController],
  providers: [ProductPhotosService],
})
export class ProductPhotosModule {}
