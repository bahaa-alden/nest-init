import { Module } from '@nestjs/common';
import { CouponsService } from './services/coupons.service';
import {
  CouponsController,
  GenericCouponsController,
} from './controllers/coupons.controller';
import { CouponRepository } from './coupon/coupon.repository';
import { UserRepository } from '../users/epositories';
import { ProductRepository } from '../products/repositories';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [CouponsController, GenericCouponsController],
  providers: [CouponsService, CouponRepository],
  exports: [CouponRepository],
})
export class CouponsModule {}
