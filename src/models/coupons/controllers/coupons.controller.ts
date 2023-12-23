import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CouponsService } from '../services/coupons.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { UpdateCouponDto } from '../dtos/update-coupon.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard, RolesGuard } from '../../../common/guards';
import { CheckAbilities, GetUser, Roles } from '../../../common/decorators';
import { User } from '../../users';
import { Action, Entities, ROLE } from '../../../common/enums';
import { Coupon } from '../entities/coupon.entity';
import {
  IGenericController,
  INestedController,
} from '../../../common/interfaces';

@ApiTags('Coupons')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'coupons', version: '1' })
export class GenericCouponsController implements IGenericController<Coupon> {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiCreatedResponse({ type: Coupon })
  @CheckAbilities({ action: Action.Create, subject: Entities.Coupon })
  @Post()
  create(@Body() dto: CreateCouponDto, @GetUser() user: User) {
    return this.couponsService.create(dto, user);
  }

  @ApiOkResponse({ type: Coupon, isArray: true })
  @Get('myCoupons')
  getMyCoupons(@GetUser('id') userId: string) {
    return this.couponsService.findMyCoupons(userId);
  }

  @ApiOkResponse({ type: Coupon })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.couponsService.getOne(id, user);
  }

  @ApiOkResponse({ type: Coupon })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
    @GetUser() user: User,
  ) {
    return this.couponsService.update(id, dto, user);
  }

  @ApiNoContentResponse({})
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.couponsService.remove(id, user);
  }
}

@ApiTags('Coupons')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'products/:productId/coupons', version: '1' })
export class CouponsController implements INestedController<Coupon> {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiCreatedResponse({ type: Coupon })
  @Post()
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateCouponDto,
    @GetUser() user: User,
  ) {
    return this.couponsService.create(dto, user, productId);
  }

  @ApiOkResponse({ type: Coupon })
  @Get()
  get(
    @Param('productId', ParseUUIDPipe) productId: string,
    @GetUser() user: User,
  ) {
    return this.couponsService.get(productId, user);
  }
}
