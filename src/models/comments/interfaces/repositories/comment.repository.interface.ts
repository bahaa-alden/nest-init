import { PaginatedResponse } from '../../../../common/types';
import { User } from '../../../users';
import { CreateCommentDto, UpdateCommentDto } from '../../dtos';
import { Comment } from '../../entities/comment.entity';

export interface ICommentRepository {
  create(
    productId: string,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment>;
  find(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Comment>>;
  findOneById(id: string): Promise<Comment>;
  update(id: string, dto: UpdateCommentDto): Promise<Comment>;
  remove(id: string): Promise<void>;
}
