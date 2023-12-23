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
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CheckAbilities, GetUser } from '../../../common/decorators';
import { User } from '../../users';
import { ProductsService } from '../services';
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
import { Action, Entities, GROUPS } from '../../../common/enums';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';

@ApiTags('Products')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController implements ICrud<Product> {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ type: Product })
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
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @SerializeOptions({ groups: [GROUPS.ALL_PRODUCTS] })
  @Get()
  get(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('is_paid') is_paid: boolean,
  ) {
    return this.productsService.get(page, limit, is_paid);
  }

  @ApiCreatedResponse({ type: Product })
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.productsService.getOne(id);
  }

  @ApiOkResponse({ type: Product })
  @CheckAbilities({ action: Action.Update, subject: Entities.Product })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.Product })
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
