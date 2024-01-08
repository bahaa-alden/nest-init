import { Injectable } from '@nestjs/common';
import { UserPhoto } from '..';
import { Repository, DataSource } from 'typeorm';
import { createBlurHash } from '../../../common/helpers';
import { CloudinaryService } from '../../../shared/cloudinary';

@Injectable()
export class UserPhotosRepository extends Repository<UserPhoto> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(UserPhoto, dataSource.createEntityManager());
  }

  async uploadPhoto(path: string) {
    if (!path) return;
    const blurHash = await createBlurHash(path);
    const uploaded = await this.cloudinaryService.uploadSinglePhoto(blurHash);
    const photo = this.create(uploaded);
    return photo;
  }
}
