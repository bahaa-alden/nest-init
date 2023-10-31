import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminImage } from '../entities/admin-image.entity';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';
import { checkIfExist } from '../../../common';

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
