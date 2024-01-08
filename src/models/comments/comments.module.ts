import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import {
  CommentsController,
  GenericCommentsController,
} from './controllers/comments.controller';
import { CommentsRepository } from './repositories';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [CommentsController, GenericCommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsRepository],
})
export class CommentsModule {}
