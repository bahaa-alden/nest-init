import { Module } from '@nestjs/common';
import { ProductsService } from './services';
import { ProductsController } from './controllers';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
