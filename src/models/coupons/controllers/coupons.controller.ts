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
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard, RolesGuard } from '../../../common/guards';
import { CheckAbilities, GetUser, Roles } from '../../../common/decorators';
import { User } from '../../users';
import { Action, Entities, ROLE } from '../../../common/enums';
import { Coupon } from '../entities/coupon.entity';

@ApiTags('Coupons')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'coupons', version: '1' })
export class GenericCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiCreatedResponse({ type: Coupon })
  @CheckAbilities({ action: Action.Create, subject: Entities.Coupon })
  @Post()
  create(@Body() dto: CreateCouponDto, @GetUser() user: User) {
    return this.couponsService.create(dto, user);
  }

  @ApiOkResponse({ type: Coupon, isArray: true })
  @CheckAbilities({ action: Action.Read, subject: Entities.Coupon })
  @Get('myCoupons')
  findMyCoupons(@GetUser() userId: string) {
    return this.couponsService.findMyCoupons(userId);
  }

  @ApiOkResponse({ type: Coupon })
  @CheckAbilities({ action: Action.Read, subject: Entities.Coupon })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.couponsService.findOne(id);
  }

  @ApiOkResponse({ type: Coupon })
  @CheckAbilities({ action: Action.Update, subject: Entities.Coupon })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
    @GetUser() user: User,
  ) {
    return this.couponsService.update(id, dto, user);
  }

  @ApiNoContentResponse({})
  @CheckAbilities({ action: Action.Delete, subject: Entities.Coupon })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.couponsService.remove(id, user);
  }
}

@ApiTags('Coupons')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@Roles(ROLE.USER)
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'products/:productId/coupons', version: '1' })
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiCreatedResponse({ type: Coupon })
  @CheckAbilities({ action: Action.Create, subject: Entities.Coupon })
  @Post()
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateCouponDto,
    @GetUser() user: User,
  ) {
    return this.couponsService.create(dto, user, productId);
  }

  @CheckAbilities({ action: Action.Read, subject: Entities.Coupon })
  @ApiOkResponse({ type: Coupon })
  @Get()
  findAll(
    @Param('productId', ParseUUIDPipe) productId: string,
    @GetUser() user: User,
  ) {
    return this.couponsService.findAll(productId, user);
  }
}
