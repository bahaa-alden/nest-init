import { Module } from '@nestjs/common';
import { ProductsService } from './services';
import { ProductsController } from './controllers';
import { ProductPhotosModule } from '../product-photos/product-photos.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [ProductPhotosModule, RouterModule.register([])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
