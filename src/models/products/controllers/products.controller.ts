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
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CheckAbilities, GetUser } from '../../../common/decorators';
import { User } from '../../users';
import { ProductsService } from '../services';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { Product } from '../entities/product.entity';
import { Action, Entities } from '../../../common/enums';

@ApiBearerAuth('token')
@ApiTags('Products')
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({ type: Product })
  @CheckAbilities({ action: Action.Create, subject: Entities.Product })
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiOkResponse({ type: Product, isArray: true })
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
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productsService.findAll(page, limit);
  }

  @ApiCreatedResponse({ type: Product })
  @CheckAbilities({ action: Action.Read, subject: Entities.Product })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
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
