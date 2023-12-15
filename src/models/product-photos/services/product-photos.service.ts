import { CaslAbilityFactory } from '../../../shared/casl/casl-ability.factory';
import { User } from '../../users';
import { CreateProductPhotoDto } from '../dto/create-product-photo.dto';
import {
  ProductRepository,
  ProductPhotosRepository,
} from '../../../shared/repositories/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../common/enums';

@Injectable()
export class ProductPhotosService {
  constructor(
    private productRepository: ProductRepository,
    private productPhotosRepository: ProductPhotosRepository,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(productId: string, user: User, dto: CreateProductPhotoDto) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, product);
    return this.productRepository.updatePhotos(productId, dto);
  }

  async find(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return this.productPhotosRepository.findAll(productId);
  }

  async remove(id: string, user: User) {
    const photo = await this.productPhotosRepository.findById(id, ['product']);
    if (!photo) throw new NotFoundException('Photo not found');
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, photo.product);
    return this.productRepository.removePhoto(photo);
  }
}
