import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserImage } from '../entities/user-image.entity';
import { checkIfExist } from './../../../common';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@Injectable()
export class UserImagesRepository extends Repository<UserImage> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(UserImage, dataSource.createEntityManager());
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
