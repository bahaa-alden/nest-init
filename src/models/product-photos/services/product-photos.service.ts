import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { User } from '../../users';
import { CreateProductPhotoDto } from '../dto/create-product-photo.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Action, Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { ProductPhotosRepository } from '../repositories/product-photos-repository';
import { IProductRepository } from '../../products/interfaces/repositories/product.repository.interface';
import { PRODUCT_TYPES } from '../../products/interfaces/type';

@Injectable()
export class ProductPhotosService {
  constructor(
    @Inject(PRODUCT_TYPES.repository)
    private productRepository: IProductRepository,
    private productPhotosRepository: ProductPhotosRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(productId: string, user: User, dto: CreateProductPhotoDto) {
    const product = await this.productRepository.findOneById(productId);
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, product);
    const photos = await this.productPhotosRepository.uploadPhotos(dto.photos);
    return this.productRepository.updatePhotos(product, photos);
  }

  async find(productId: string) {
    const product = await this.productRepository.findOneById(productId);
    if (!product)
      throw new NotFoundException(item_not_found(Entities.Permission));
    return this.productPhotosRepository.find(productId);
  }

  async remove(id: string, user: User) {
    const photo = await this.productPhotosRepository.findOne(id, ['product']);
    if (!photo) throw new NotFoundException(item_not_found(Entities.Photo));
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, photo.product);
    await this.productPhotosRepository.remove(photo);
  }
}
