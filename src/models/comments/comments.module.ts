import { Module, Provider } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import {
  CommentsController,
  GenericCommentsController,
} from './controllers/comments.controller';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products';
import { ProductPhoto } from '../product-photos';
import { ProductPhotosRepository } from '../product-photos/repositories/product-photos-repository';
import { ProductRepository } from '../products/repositories/product.repository';
import { COMMENT_TYPES } from './interfaces/type';

export const CommentsServiceProvider: Provider = {
  provide: COMMENT_TYPES.service,
  useClass: CommentsService,
};

export const CommentRepositoryProvider: Provider = {
  provide: COMMENT_TYPES.repository,
  useClass: CommentRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Product, ProductPhoto])],
  controllers: [CommentsController, GenericCommentsController],
  providers: [
    ProductRepository,
    ProductPhotosRepository,
    CommentRepositoryProvider,
    CommentsServiceProvider,
  ],
  exports: [CommentRepositoryProvider, CommentsServiceProvider],
})
export class CommentsModule {}
