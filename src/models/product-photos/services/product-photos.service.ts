import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { User } from '../../users';
import { CreateProductPhotoDto } from '../dto/create-product-photo.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Action, Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { ProductRepository } from '../../products/repositories';
import { ProductPhotosRepository } from '../repositories/product-photos-repository';

@Injectable()
export class ProductPhotosService {
  constructor(
    private productRepository: ProductRepository,
    private productPhotosRepository: ProductPhotosRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(productId: string, user: User, dto: CreateProductPhotoDto) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, product);
    return this.productRepository.updatePhotos(productId, dto);
  }

  async find(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product)
      throw new NotFoundException(item_not_found(Entities.Permission));
    return this.productPhotosRepository.findAll(productId);
  }

  async remove(id: string, user: User) {
    const photo = await this.productPhotosRepository.findById(id, ['product']);
    if (!photo) throw new NotFoundException(item_not_found(Entities.Photo));
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, photo.product);
    return this.productRepository.removePhoto(photo);
  }
}
