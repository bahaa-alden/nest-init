import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../../../shared/repositories/comment';
import { Comment } from '../entities/comment.entity';
import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { User } from '../../users';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../common/enums';
import { ProductRepository } from '../../../shared/repositories/product/product.repository';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';

@Injectable()
export class CommentsService implements ICrud<Comment> {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly productRepository: ProductRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async get(productId: string, page: number, limit: number) {
    return this.commentRepository.findAll(productId, page, limit);
  }

  async getOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async create(
    productId: string,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return this.commentRepository.createOne(product, user, dto);
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.getOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, comment);
    return this.commentRepository.updateOne(id, dto); // Return the updated comment
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.getOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, comment);
    await comment.remove();
  }
}
