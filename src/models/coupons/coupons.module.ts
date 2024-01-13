import { Module } from '@nestjs/common';
import { CouponsService } from './services/coupons.service';
import {
  CouponsController,
  GenericCouponsController,
} from './controllers/coupons.controller';
import { Coupon } from './entities/coupon.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponRepository } from './repositories/coupon.repository';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), ProductsModule, UsersModule],
  controllers: [CouponsController, GenericCouponsController],
  providers: [CouponsService, CouponRepository],
  exports: [CouponRepository, CouponsService],
})
export class CouponsModule {}
