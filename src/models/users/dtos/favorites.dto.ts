import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  readonly favoriteCities: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  readonly favoriteCategories: string[];
}
