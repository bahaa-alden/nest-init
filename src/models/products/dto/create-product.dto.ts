import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { IsPhotoExist } from '../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { getPhotosPath } from '../../../common/helpers';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }: { value: string[] }) => getPhotosPath(value))
  @IsPhotoExist({ each: true })
  photos: string[];

  @ApiProperty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsUUID()
  storeId: string;
}
