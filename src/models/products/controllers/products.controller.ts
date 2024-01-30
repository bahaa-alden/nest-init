import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  SerializeOptions,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req,
  Inject,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CheckAbilities, GetUser, Roles } from '../../../common/decorators';
import { User } from '../../users';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { Product } from '../entities/product.entity';
import { Action, Entities, GROUPS, ROLE } from '../../../common/enums';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { Request } from 'express';
import { IProductsService } from '../interfaces/services/products.service.interface';
import { PRODUCT_TYPES } from '../interfaces/type';

@ApiTags('Products')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController implements ICrud<Product> {
  constructor(
    @Inject(PRODUCT_TYPES.service)
    private readonly productsService: IProductsService,
  ) {}

  @ApiCreatedResponse({ type: Product })
  @Roles(ROLE.USER)
  @CheckAbilities({ action: Action.Create, subject: Entities.Product })
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiOkResponse({ type: PaginatedResponse<Product> })
  @ApiQuery({
    name: 'page',
    allowEmptyValue: false,
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    allowEmptyValue: false,
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'is_paid',
    allowEmptyValue: false,
    type: 'boolean',
    example: false,
  })
  @ApiQuery({
    name: 'q',
    allowEmptyValue: false,
    type: 'string',
    required: false,
  })
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @SerializeOptions({ groups: [GROUPS.ALL_PRODUCTS] })
  @Get()
  find(
    @Query('page') page: number,
    @Query('limit')
    limit: number,
    @Query('is_paid')
    is_paid: boolean,
    @Query('q')
    q: string,
    @GetUser() user: User,
  ) {
    return this.productsService.find(page, limit, is_paid, q, user);
  }

  @ApiOkResponse({ description: 'ok' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Product })
  @Roles(ROLE.USER)
  @HttpCode(HttpStatus.OK)
  @Post(':id/likes')
  async like(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.productsService.like(id, user);
  }

  @ApiOkResponse({ description: 'ok' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Product })
  @Roles(ROLE.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id/likes')
  async dislike(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.productsService.dislike(id, user);
  }

  @ApiCreatedResponse({ type: Product })
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @SerializeOptions({ groups: [GROUPS.PRODUCT] })
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Req() req: Request & { query: { isOwner: string } },
  ) {
    const isOwner = JSON.parse(req.query.isOwner);
    return this.productsService.findOne(id, user, isOwner);
  }

  @ApiOkResponse({ type: Product })
  @CheckAbilities({ action: Action.Update, subject: Entities.Product })
  @Roles(ROLE.USER)
  @SerializeOptions({ groups: [GROUPS.PRODUCT] })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.Product })
  @SerializeOptions({ groups: [GROUPS.PRODUCT] })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
