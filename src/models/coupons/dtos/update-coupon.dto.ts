import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateCouponDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  discount: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expire: Date;
}
