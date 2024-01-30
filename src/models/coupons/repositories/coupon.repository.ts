import { FindOptionsWhere, IsNull, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCouponDto, UpdateCouponDto } from '../dtos';
import { Coupon } from '../entities/coupon.entity';
import { ICouponRepository } from '../interfaces/repositories/coupon.repository.interface';
import { Product } from '../../products';
import { User } from '../../users';

@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepo: Repository<Coupon>,
  ) {}

  async create(
    dto: CreateCouponDto,
    proOwner: User,
    user: User,
    product: Product,
  ): Promise<Coupon> {
    const coupon = this.couponRepo.create({
      proOwner,
      user,
      product,
      discount: dto.discount,
      expire: dto.expire,
    });
    await this.couponRepo.save(coupon);
    return coupon;
  }

  async find(options?: FindOptionsWhere<Coupon>): Promise<Coupon[]> {
    const currentDate = new Date();
    const where: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[] =
      options.productId
        ? { ...options, active: true, product: { is_paid: false } }
        : [
            {
              ...options,
              expire: MoreThan(currentDate),
              active: true,
              product: { is_paid: false },
            },
            {
              ...options,
              expire: IsNull(),
              active: true,
              product: { is_paid: false },
            },
          ];

    return this.couponRepo.find({
      where,
      select: {
        id: true,
        discount: true,
        expire: true,
        user: { name: true },
        proOwner: { name: true },
        product: {
          id: true,
          title: true,
          price: true,
          is_paid: true,
          category: { name: true },
        },
      },
      relations: {
        user: { photos: true },
        proOwner: { photos: true },
        product: { category: true, photos: true },
      },
    });
  }

  async findOne(id: string): Promise<Coupon> {
    return this.couponRepo.findOne({
      where: { id, active: true, product: { is_paid: false } },
      select: {
        id: true,
        discount: true,
        expire: true,
        user: { id: true, name: true },
        userId: true,
        proOwner: { id: true, name: true },
        proOwnerId: true,
        product: {
          id: true,
          title: true,
          price: true,
          is_paid: true,
          category: { name: true },
        },
        productId: true,
      },
      relations: {
        user: { photos: true },
        proOwner: { photos: true },
        product: { category: true, photos: true },
      },
    });
  }
  async existedCoupon(productId: string, userId: string): Promise<Coupon> {
    return this.couponRepo.findOne({
      where: { productId, userId },
      withDeleted: true,
    });
  }

  async update(coupon: Coupon, dto: UpdateCouponDto): Promise<Coupon> {
    Object.assign(coupon, dto);
    await this.couponRepo.update(coupon.id, coupon);
    return this.findOne(coupon.id);
  }

  async remove(coupon: Coupon): Promise<void> {
    await this.couponRepo.remove(coupon);
    return;
  }
}
