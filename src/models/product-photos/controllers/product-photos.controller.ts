import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProductPhotoDto } from '../dto/create-product-photo.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CheckAbilities, GetUser } from '../../../common/decorators';
import { Action, Entities } from '../../../common/enums';
import { ProductPhoto } from '../entities/product-photo.entity';
import { User } from '../../users';
import { ProductPhotosService } from '../services/product-photos.service';
import { Product } from '../../products';

@ApiTags('Product-Photos')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@UseGuards(CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Update, subject: Entities.Product })
@Controller({ path: 'products/:productId/product-photos', version: '1' })
export class ProductPhotosController {
  constructor(private readonly productPhotosService: ProductPhotosService) {}
  @ApiCreatedResponse({ type: Product })
  @ApiOperation({
    summary: 'add new photos to the product ',
    description: 'add new photos to the product by productId',
  })
  @Post()
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateProductPhotoDto,
    @GetUser() user: User,
  ) {
    return this.productPhotosService.create(productId, user, dto);
  }

  @ApiOkResponse({ isArray: true, type: ProductPhoto })
  @ApiOperation({
    summary: 'Get product photos',
    description: 'Get all the product photos by productId',
  })
  @Get()
  async getOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productPhotosService.find(productId);
  }
}

@ApiTags('Product-Photos')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@UseGuards(CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Read, subject: Entities.Product })
@Controller({ path: 'product-photos', version: '1' })
export class GenericProductPhotosController {
  constructor(private readonly productPhotosService: ProductPhotosService) {}

  @ApiOperation({
    summary: "delete one product's photos",
    description: "delete one  product's photo by photoId",
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.productPhotosService.remove(id, user);
  }
}
