import { Module } from '@nestjs/common';
import { CouponsService } from './services/coupons.service';
import {
  CouponsController,
  GenericCouponsController,
} from './controllers/coupons.controller';

@Module({
  controllers: [CouponsController, GenericCouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
