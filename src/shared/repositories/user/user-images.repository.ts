import { Injectable } from '@nestjs/common';
import { checkIfExist } from './../../../common';
import { UserImage } from './../../../models/users';
import { Repository, DataSource } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

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
