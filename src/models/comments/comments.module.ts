import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import {
  CommentsController,
  GenericCommentsController,
} from './controllers/comments.controller';

@Module({
  controllers: [CommentsController, GenericCommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
