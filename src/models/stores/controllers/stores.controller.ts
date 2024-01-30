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
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { CreateStoreDto } from '../dtos';
import { UpdateStoreDto } from '../dtos';
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
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CheckAbilities } from '../../../common/decorators';
import { Action, Entities } from '../../../common/enums';
import { Store } from '../entities/store.entity';
import { ICrud } from '../../../common/interfaces';
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { IStoresService } from '../interfaces/services/stores.service.interface';
import { STORE_TYPES } from '../interfaces/type';

@ApiTags('Stores')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'stores', version: '1' })
export class StoresController implements ICrud<Store> {
  constructor(
    @Inject(STORE_TYPES.service) private readonly storesService: IStoresService,
  ) {}

  @ApiCreatedResponse({ description: 'Store has created', type: Store })
  @CheckAbilities({ action: Action.Create, subject: Entities.Store })
  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @ApiOkResponse({ type: Store, isArray: true, description: 'get all Stores' })
  @CheckAbilities({ action: Action.Read, subject: Entities.Store })
  @Get()
  find() {
    return this.storesService.find();
  }

  @ApiOkResponse({ type: Store, description: 'get one Store' })
  @CheckAbilities({ action: Action.Read, subject: Entities.Store })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findOne(id);
  }

  @ApiOkResponse({ type: Store, description: 'update Store' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Store })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @ApiOkResponse({ type: Store, description: 'recover deleted Store' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Store })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.recover(id);
  }

  @ApiNoContentResponse({ description: 'delete Store' })
  @CheckAbilities({ action: Action.Delete, subject: Entities.Store })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.remove(id);
  }
}
