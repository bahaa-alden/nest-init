import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expire: Date;
}
