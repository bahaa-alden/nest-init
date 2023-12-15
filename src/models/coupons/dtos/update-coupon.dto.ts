import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateCouponDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  expire: Date;
}
