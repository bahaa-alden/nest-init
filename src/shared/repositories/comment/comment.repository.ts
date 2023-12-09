import { Injectable } from '@nestjs/common';
import { Comment } from '../../../models/comments';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private readonly dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }
  async findById(id: string) {
    return this.findOne({ where: { id } });
  }
}
