import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { createBlurHashs } from '../../../common/helpers';
import { ProductPhoto } from '..';
import { IPhotoRepository } from '../../../common/interfaces';
import { CloudinaryService } from '../../../shared/cloudinary';

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

  async findAll(productId: string) {
    return this.find({ where: { productId } });
  }

  async findById(id: string, relations?: string[]) {
    return this.findOne({ where: { id }, relations });
  }

  async uploadPhotos(paths: string[]) {
    const blurHashs = await createBlurHashs(paths);
    const uploaded = await this.cloudinaryService.uploadMultiplePhotos(
      blurHashs,
    );

    const photos = uploaded.map((p) => this.create({ ...p }));
    return photos;
  }

  async removeOne(photo: ProductPhoto) {
    await this.cloudinaryService.removePhoto(photo.publicId);
    await photo.remove();
    return;
  }
}
