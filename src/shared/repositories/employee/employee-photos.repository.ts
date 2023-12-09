import { Injectable } from '@nestjs/common';
import { createBlurHash } from '../../../common/helpers';
import { EmployeePhoto } from '../../../models/employees';
import { Repository, DataSource } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

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
