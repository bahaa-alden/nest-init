import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsString, IsNumber, Min, IsUUID, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  storeId: string;
}
