import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { User } from '../../users';
import { ForbiddenError } from '@casl/ability';
import { Action, Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { ProductRepository } from '../../products/repositories/product.repository';
import { ICommentRepository } from '../interfaces/repositories/comment.repository.interface';
import { COMMENT_TYPES } from '../interfaces/type';
import { ICommentsService } from '../interfaces/services/comments.service.interface';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @Inject(COMMENT_TYPES.repository)
    private readonly commentRepository: ICommentRepository,
    private readonly productRepository: ProductRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async find(productId: string, page: number, limit: number) {
    return this.commentRepository.find(productId, page, limit);
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOneById(id);
    if (!comment) {
      throw new NotFoundException(item_not_found(Entities.Comment));
    }
    return comment;
  }

  async create(
    productId: string,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const product = await this.productRepository.findOneById(productId);
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));
    return this.commentRepository.create(productId, user, dto);
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, comment);
    return this.commentRepository.update(id, dto); // Return the updated comment
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, comment);
    await this.commentRepository.remove(id);
  }
}
