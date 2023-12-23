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
} from '@nestjs/common';
import { StoresService } from '../services/stores.service';
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

@ApiTags('Stores')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: 'You can not perform this action' })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'stores', version: '1' })
export class StoresController implements ICrud<Store> {
  constructor(private readonly storesService: StoresService) {}

  @ApiCreatedResponse({ description: 'Store has created', type: Store })
  @CheckAbilities({ action: Action.Create, subject: Entities.Store })
  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @ApiOkResponse({ type: Store, isArray: true, description: 'get all Stores' })
  @CheckAbilities({ action: Action.Read, subject: Entities.Store })
  @Get()
  get() {
    return this.storesService.get();
  }

  @ApiOkResponse({ type: Store, description: 'get one Store' })
  @CheckAbilities({ action: Action.Read, subject: Entities.Store })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.getOne(id);
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
