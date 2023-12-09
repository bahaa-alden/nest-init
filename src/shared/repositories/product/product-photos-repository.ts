import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { createBlurHashs } from '../../../common/helpers';
import { ProductPhoto } from '../../../models/product-photos';
import { IPhotoRepository } from '../../../common/interfaces';

@Injectable()
export class ProductPhotosRepository
  extends Repository<ProductPhoto>
  implements IPhotoRepository<ProductPhoto>
{
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ProductPhoto, dataSource.createEntityManager());
  }

  async uploadPhotos(paths: string[]) {
    const blurHashs = await createBlurHashs(paths);
    const uploaded = await this.cloudinaryService.uploadMultiplePhotos(
      blurHashs,
    );
    const photos = uploaded.map((p) => this.create(p));
    return photos;
  }

  async findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async removeOne(publicId: string) {
    return await this.cloudinaryService.removePhoto(publicId);
  }
}
