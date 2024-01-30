import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto, UpdateCommentDto } from '../dtos';
import { Comment } from '../entities/comment.entity';
import { ICommentRepository } from '../interfaces/repositories/comment.repository.interface';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
  ) {}

  async create(
    productId: string,
    user: User,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = this.commentsRepo.create({
      product: { id: productId },
      user,
      ...dto,
    });
    await comment.save();
    return comment;
  }

  async find(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Comment>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.commentsRepo.find({
      where: { productId },
      skip,
      take,
    });
    const totalDataCount = await this.commentsRepo.count({
      where: { productId },
    });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneById(id: string): Promise<Comment> {
    return this.commentsRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    await this.commentsRepo.update(id, dto);
    return this.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    this.commentsRepo.delete(id);
    return;
  }
}
