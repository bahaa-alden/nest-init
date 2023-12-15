import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { UpdateCouponDto } from '../dtos/update-coupon.dto';
import { UserRepository } from '../../../shared/repositories/user/user.repository';
import { ProductRepository } from '../../../shared/repositories/product/product.repository';
import { CouponRepository } from '../../../shared/repositories/coupon/coupon.repository';
import { User } from '../../users';
import { CaslAbilityFactory } from '../../../shared/casl';
import { ForbiddenError } from '@casl/ability';
import { Action } from '../../../common/enums';

@Injectable()
export class CouponsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async create(dto: CreateCouponDto, proOwner: User, productId?: string) {
    const prodId = dto.productId || productId;
    const product = await this.isProductOwner(prodId, proOwner);
    const user = await this.userRepository.findByIdForThings(dto.userId);
    if (!user) throw new NotFoundException('User not found');
    const exist = await this.couponRepository.existedCoupon(prodId, dto.userId);
    if (exist) throw new ConflictException('Coupon already exist');
    const coupon = await this.couponRepository.createOne(
      dto,
      proOwner,
      user,
      product,
    );
    return coupon;
  }

  async findAll(productId: string, user: User) {
    await this.isProductOwner(productId, user);
    const coupons = await this.couponRepository.findAll({ productId });
    return coupons;
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async findMyCoupons(userId: string) {
    const coupons = await this.couponRepository.findAll({ userId });
    return coupons;
  }

  async update(id: string, dto: UpdateCouponDto, user: User) {
    const coupon = await this.couponCasl(id, user, Action.Update);
    return this.couponRepository.updateOne(coupon, dto);
  }

  async remove(id: string, user: User) {
    const coupon = await this.couponCasl(id, user, Action.Delete);
    return coupon.softRemove();
  }

  async couponCasl(id: string, user: User, action: Action) {
    const coupon = await this.findOne(id);
    const ability = this.caslAbilityFactory.defineAbility(user);
    ForbiddenError.from(ability).throwUnlessCan(action, coupon);
    return coupon;
  }
  async isProductOwner(productId: string, proOwner: User) {
    const product = await this.productRepository.findByIdForThings(productId);
    if (!product) throw new NotFoundException('Product not found');
    if (product.user.id !== proOwner.id)
      throw new ForbiddenException('You can not perform this action');
    return product;
  }
}
