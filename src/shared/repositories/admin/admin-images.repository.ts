import { Injectable } from '@nestjs/common';
import { checkIfExist } from './../../../common';
import { AdminImage } from './../../../models/admins';
import { Repository, DataSource } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class AdminImagesRepository extends Repository<AdminImage> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(AdminImage, dataSource.createEntityManager());
  }

  async updatePhoto(url: string) {
    if (!url) return;
    const res = await checkIfExist(url);
    const uploaded = await this.cloudinaryService.uploadSingleImage(res);
    const photo = this.create({
      ...uploaded,
    });
    return photo;
  }
}
