import { Injectable } from '@nestjs/common';
import {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
} from '../../../models/comments';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../../../models/products/entities/product.entity';
import { User } from '../../../models/users';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async createOne(product: Product, user: User, dto: CreateCommentDto) {
    const comment = this.create({ product, user, ...dto });
    await comment.save();
    return comment;
  }

  async findAll(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Comment>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.find({
      where: { productId },
      skip,
      take,
    });
    const totalDataCount = await this.count({ where: { productId } });

    return pagination(page, limit, totalDataCount, data);
  }
  async findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async updateOne(id: string, dto: UpdateCommentDto) {
    await this.update(id, dto);
    return this.findById(id);
  }
}
