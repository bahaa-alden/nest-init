import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { UpdateCouponDto } from '../dtos/update-coupon.dto';

import { User } from '../../users';
import { CaslAbilityFactory } from '../../../shared/casl';
import { ForbiddenError } from '@casl/ability';
import { Action, Entities } from '../../../common/enums';
import { Coupon } from '../entities/coupon.entity';
import { ICrud } from '../../../common/interfaces';
import {
  denied_error,
  item_already_exist,
  item_not_found,
} from '../../../common/constants';
import { ProductRepository } from '../../products/repositories/product.repository';
import { CouponRepository } from '../repositories/coupon.repository';
import { USER_TYPES } from '../../users/interfaces/type';
import { IUserRepository } from '../../users/interfaces/repositories/user.repository.interface';

@Injectable()
export class CouponsService implements ICrud<Coupon> {
  constructor(
    @Inject(USER_TYPES.repository.user)
    private readonly userRepository: IUserRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async create(dto: CreateCouponDto, proOwner: User, productId?: string) {
    const prodId = dto.productId || productId;
    const product = await this.isProductOwner(prodId, proOwner);
    const user = await this.userRepository.findByIdForThings(dto.userId);
    if (!user) throw new NotFoundException(item_not_found(Entities.User));
    const exist = await this.couponRepository.existedCoupon(prodId, dto.userId);
    if (exist) throw new ConflictException(item_already_exist(Entities.Coupon));
    const coupon = await this.couponRepository.create(
      dto,
      proOwner,
      user,
      product,
    );
    return coupon;
  }

  async find(productId: string, user: User) {
    await this.isProductOwner(productId, user);
    const coupons = await this.couponRepository.find({ productId });
    return coupons;
  }

  async findOne(id: string, user?: User) {
    const coupon = await this.couponRepository.findOne(id);
    if (!coupon) throw new NotFoundException(item_not_found(Entities.Coupon));
    if (user) await this.couponCasl(coupon, user, Action.Read);
    return coupon;
  }

  async findMyCoupons(userId: string) {
    const coupons = await this.couponRepository.find({ userId });
    return coupons;
  }

  async update(id: string, dto: UpdateCouponDto, user: User) {
    const coupon = await this.findOne(id, user);
    await this.couponCasl(coupon, user, Action.Update);
    return this.couponRepository.update(coupon, dto);
  }

  async remove(id: string, user: User) {
    const coupon = await this.findOne(id, user);
    await this.couponCasl(coupon, user, Action.Delete);
    await coupon.remove();
    return;
  }

  async couponCasl(coupon: Coupon, user: User, action: Action) {
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(action, coupon);
    return coupon;
  }

  async isProductOwner(productId: string, proOwner: User) {
    const product = await this.productRepository.findByIdForThings(productId);
    if (!product) throw new NotFoundException(item_not_found(Entities.Product));
    if (product.user.id !== proOwner.id)
      throw new ForbiddenException(denied_error);
    return product;
  }
}
