import { COUPON_TYPES } from './../interfaces/type';
import {
  ConflictException,
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
import { item_already_exist, item_not_found } from '../../../common/constants';
import { USER_TYPES } from '../../users/interfaces/type';
import { IUserRepository } from '../../users/interfaces/repositories/user.repository.interface';
import { PRODUCT_TYPES } from '../../products/interfaces/type';
import { ICouponsService } from '../interfaces/services/coupons.service.interface';
import { IProductsService } from '../../products/interfaces/services/products.service.interface';
import { ICouponRepository } from '../interfaces/repositories/coupon.repository.interface';

@Injectable()
export class CouponsService implements ICouponsService {
  constructor(
    @Inject(USER_TYPES.repository.user)
    private readonly userRepository: IUserRepository,
    @Inject(PRODUCT_TYPES.service)
    private productsService: IProductsService,
    @Inject(COUPON_TYPES.repository)
    private couponRepository: ICouponRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async create(
    dto: CreateCouponDto,
    proOwner: User,
    productId?: string,
  ): Promise<Coupon> {
    const prodId = dto.productId || productId;
    const product = await this.productsService.isProductOwner(prodId, proOwner);
    const user = await this.userRepository.findOneByIdForThings(dto.userId);
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

  async find(productId: string, user: User): Promise<Coupon[]> {
    await this.productsService.isProductOwner(productId, user);
    const coupons = await this.couponRepository.find({ productId });
    return coupons;
  }

  async findOne(id: string, user?: User): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne(id);
    if (!coupon) throw new NotFoundException(item_not_found(Entities.Coupon));
    if (user) await this.couponCasl(coupon, user, Action.Read);
    return coupon;
  }

  async findMyCoupons(userId: string): Promise<Coupon[]> {
    const coupons = await this.couponRepository.find({ userId });
    return coupons;
  }

  async update(id: string, dto: UpdateCouponDto, user: User): Promise<Coupon> {
    const coupon = await this.findOne(id, user);
    await this.couponCasl(coupon, user, Action.Update);
    return this.couponRepository.update(coupon, dto);
  }

  async remove(id: string, user: User): Promise<void> {
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
}
