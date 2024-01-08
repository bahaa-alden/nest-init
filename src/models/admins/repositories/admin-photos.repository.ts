import { Injectable } from '@nestjs/common';
import { AdminPhoto } from '../../../models/admins';
import { Repository, DataSource } from 'typeorm';
import { createBlurHash, getPhotoPath } from '../../../common/helpers';
import { CloudinaryService } from '../../../shared/cloudinary';

@Injectable()
export class AdminPhotosRepository extends Repository<AdminPhoto> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(AdminPhoto, dataSource.createEntityManager());
  }

  async uploadPhoto(path: string) {
    if (!path) return;
    const blurHash = await createBlurHash(path);
    const uploaded = await this.cloudinaryService.uploadSinglePhoto(blurHash);
    const photo = this.create({
      ...uploaded,
    });
    return photo;
  }
}
