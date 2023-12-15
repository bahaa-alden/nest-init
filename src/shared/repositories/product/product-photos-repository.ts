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
