import { Module, Provider } from '@nestjs/common';
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
import { COUPON_TYPES } from './interfaces/type';

export const CouponsServiceProvider: Provider = {
  provide: COUPON_TYPES.service,
  useClass: CouponsService,
};
export const CouponRepositoryProvider: Provider = {
  provide: COUPON_TYPES.repository,
  useClass: CouponRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), ProductsModule, UsersModule],
  controllers: [CouponsController, GenericCouponsController],
  providers: [CouponsServiceProvider, CouponRepositoryProvider],
  exports: [CouponsServiceProvider, CouponRepositoryProvider],
})
export class CouponsModule {}
