import {
  DataSource,
  FindOptionsWhere,
  IsNull,
  MoreThan,
  Repository,
} from 'typeorm';
import { Coupon, UpdateCouponDto } from '../../../models/coupons';
import { Injectable } from '@nestjs/common';
import { User } from '../../../models/users';
import { Product } from '../../../models/products/entities/product.entity';
import { CreateCouponDto } from '../../../models/coupons/dtos/create-coupon.dto';

@Injectable()
export class CouponRepository extends Repository<Coupon> {
  constructor(private readonly dataSource: DataSource) {
    super(Coupon, dataSource.createEntityManager());
  }

  async findAll(options?: FindOptionsWhere<Coupon>) {
    const currentDate = new Date();
    return this.find({
      where: [
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
      ],
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

  async findById(id: string) {
    const currentDate = new Date();
    return this.findOne({
      where: [
        {
          id,
          expire: MoreThan(currentDate),
          active: true,
          product: { is_paid: false },
        },
        {
          id,
          expire: IsNull(),
          active: true,
          product: { is_paid: false },
        },
      ],
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
  async existedCoupon(productId: string, userId: string) {
    return this.findOne({ where: { productId, userId }, withDeleted: true });
  }
  async createOne(
    dto: CreateCouponDto,
    proOwner: User,
    user: User,
    product: Product,
  ) {
    const coupon = this.create({
      proOwner,
      user,
      product,
      discount: dto.discount,
      expire: dto.expire,
    });
    await this.save(coupon);
    return coupon;
  }

  async updateOne(coupon: Coupon, dto: UpdateCouponDto) {
    Object.assign(coupon, dto);
    this.update(coupon.id, coupon);
    return this.findById(coupon.id);
  }
}