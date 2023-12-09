import { Injectable } from '@nestjs/common';
import { UserPhoto } from '../../../models/users';
import { Repository, DataSource } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { createBlurHash } from '../../../common/helpers';

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
