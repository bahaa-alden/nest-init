import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createBlurHashs } from '../../../common/helpers';
import { IPhotoRepository } from '../../../common/interfaces';
import { CloudinaryService } from '../../../shared/cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPhoto } from '../entities/product-photo.entity';

@Injectable()
export class ProductPhotosRepository implements IPhotoRepository<ProductPhoto> {
  constructor(
    @InjectRepository(ProductPhoto)
    private readonly productPhotosRepo: Repository<ProductPhoto>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async find(productId: string) {
    return this.productPhotosRepo.find({ where: { productId } });
  }

  async findOne(id: string, relations?: string[]) {
    return this.productPhotosRepo.findOne({ where: { id }, relations });
  }

  async uploadPhotos(paths: string[]) {
    const blurHashs = await createBlurHashs(paths);
    const uploaded = await this.cloudinaryService.uploadMultiplePhotos(
      blurHashs,
    );
    const photos = uploaded.map((p) => this.productPhotosRepo.create({ ...p }));
    return photos;
  }

  async remove(photo: ProductPhoto) {
    await this.cloudinaryService.removePhoto(photo.publicId);
    await photo.remove();
  }
}
