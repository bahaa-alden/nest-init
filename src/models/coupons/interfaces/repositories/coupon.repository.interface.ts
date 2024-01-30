import { FindOptionsWhere } from 'typeorm';
import { CreateCouponDto, UpdateCouponDto } from '../../dtos';
import { Coupon } from '../../entities/coupon.entity';
import { Product } from '../../../products';
import { User } from '../../../users';

export interface ICouponRepository {
  create(
    dto: CreateCouponDto,
    proOwner: User,
    user: User,
    product: Product,
  ): Promise<Coupon>;

  find(options?: FindOptionsWhere<Coupon>): Promise<Coupon[]>;

  findOne(id: string): Promise<Coupon>;

  existedCoupon(productId: string, userId: string): Promise<Coupon>;

  update(coupon: Coupon, dto: UpdateCouponDto): Promise<Coupon>;

  remove(coupon: Coupon): Promise<void>;
}
