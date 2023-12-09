import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { IsPhotoExist } from '../../../common/decorators';
import { getPhotosPath } from '../../../common/helpers';

export class CreateProductPhotoDto {
  @ApiProperty()
  @IsString({ each: true })
  @Transform(({ value }: { value: string[] }) => getPhotosPath(value))
  @IsPhotoExist({ each: true })
  photos: string[];
}
