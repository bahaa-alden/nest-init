import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CommentsRepository } from '../../../shared/repositories/comment';
import { Comment } from '../entities/comment.entity';
import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { User } from '../../users';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../common/enums';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findAll(page: number, limit: number): Promise<Comment[]> {
    const skip = ((page - 1) * limit) | 0;
    const take = limit | 100;
    return this.commentRepository.find({
      skip,
      take,
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(dto);
    return this.commentRepository.save(comment);
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, comment);
    await this.commentRepository.update(id, dto);
    return this.findOne(id); // Return the updated comment
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id); // Check if the comment exists
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, comment);
    await comment.remove();
  }
}
