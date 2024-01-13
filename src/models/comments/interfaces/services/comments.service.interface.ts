import { PaginatedResponse } from '../../../../common/types';
import { User } from '../../../users';
import { CreateCommentDto, UpdateCommentDto } from '../../dtos';
import { Comment } from '../../entities/comment.entity';

export interface ICommentsService {
  create(
    productId: string,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment>;
  find(
    productId: string,
    page: number,
    limit: number,
  ): Promise<Comment[] | PaginatedResponse<Comment>>;
  findOne(id: string): Promise<Comment>;
  update(id: string, dto: UpdateCommentDto, user: User): Promise<Comment>;
  remove(id: string, user: User): Promise<any>;
}
