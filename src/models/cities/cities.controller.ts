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
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dtos';
import { UpdateCityDto } from './dtos';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../common/guards';
import { CheckAbilities } from '../../common/decorators';
import { Action, Entities } from '../../common/enums';
import { City } from './entities/city.entity';

@ApiTags('cities')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Manage, subject: Entities.City })
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiCreatedResponse({ description: 'city has created', type: City })
  @Post()
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto);
  }

  @ApiOkResponse({ type: City, isArray: true, description: 'get all cities' })
  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @ApiOkResponse({ type: City, description: 'get one city' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.findOne(id);
  }

  @ApiOkResponse({ type: City, description: 'update city' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCityDto) {
    return this.citiesService.update(id, dto);
  }

  @ApiOkResponse({ type: City, description: 'recover deleted city' })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.recover(id);
  }

  @ApiNoContentResponse({ description: 'delete City' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.citiesService.remove(id);
  }
}
