import { User } from '../../../users';
import { CreateCouponDto, UpdateCouponDto } from '../../dtos';
import { Coupon } from '../../entities/coupon.entity';

export interface ICouponsService {
  create(
    dto: CreateCouponDto,
    proOwner: User,
    productId?: string,
  ): Promise<Coupon>;

  find(productId: string, user: User): Promise<Coupon[]>;

  findOne(id: string, user?: User): Promise<Coupon>;

  findMyCoupons(userId: string): Promise<Coupon[]>;
  update(id: string, dto: UpdateCouponDto, user: User): Promise<Coupon>;

  remove(id: string, user: User): Promise<void>;
}
