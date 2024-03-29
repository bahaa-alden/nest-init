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
  Inject,
} from '@nestjs/common';
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
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { COUPON_TYPES } from '../interfaces/type';
import { ICouponsService } from '../interfaces/services/coupons.service.interface';

@ApiTags('Coupons')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'coupons', version: '1' })
export class GenericCouponsController implements IGenericController<Coupon> {
  constructor(
    @Inject(COUPON_TYPES.service)
    private readonly couponsService: ICouponsService,
  ) {}

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
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.couponsService.findOne(id, user);
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
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'products/:productId/coupons', version: '1' })
export class CouponsController implements INestedController<Coupon> {
  constructor(
    @Inject(COUPON_TYPES.service)
    private readonly couponsService: ICouponsService,
  ) {}

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
  find(
    @Param('productId', ParseUUIDPipe) productId: string,
    @GetUser() user: User,
  ) {
    return this.couponsService.find(productId, user);
  }
}
