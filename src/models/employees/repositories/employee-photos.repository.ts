import { CloudinaryService } from './../../../shared/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { createBlurHash } from '../../../common/helpers';
import { EmployeePhoto } from '..';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class EmployeePhotosRepository extends Repository<EmployeePhoto> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(EmployeePhoto, dataSource.createEntityManager());
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
