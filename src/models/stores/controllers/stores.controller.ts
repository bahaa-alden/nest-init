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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common';
import { CheckAbilities } from '../../../common';
import { Action, Entities } from '../../../common';
import { Store } from '../entities/store.entity';

@ApiTags('Stores')
@ApiBearerAuth('token')
@CheckAbilities({ action: Action.Manage, subject: Entities.Store })
@UseGuards(CaslAbilitiesGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiCreatedResponse({ description: 'Store has created', type: Store })
  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @ApiOkResponse({ type: Store, isArray: true, description: 'get all Stores' })
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @ApiOkResponse({ type: Store, description: 'get one Store' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findOne(id);
  }

  @ApiOkResponse({ type: Store, description: 'update Store' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @ApiOkResponse({ type: Store, description: 'recover deleted Store' })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.recover(id);
  }

  @ApiNoContentResponse({ description: 'delete Store' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.remove(id);
  }
}
