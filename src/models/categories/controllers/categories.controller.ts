import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CheckAbilities } from '../../../common/decorators';
import { Action, Entities } from '../../../common/enums';
import { Category } from '../entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @CheckAbilities({ action: Action.Create, subject: Entities.Category })
  @ApiCreatedResponse({ type: Category })
  @Post()
  create(@Body() dto: CreateCategoryDto): any {
    return this.categoriesService.create(dto);
  }

  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @ApiOkResponse({ type: Category, isArray: true })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @ApiOkResponse({ type: Category })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @CheckAbilities({ action: Action.Update, subject: Entities.Category })
  @ApiOkResponse({ type: Category })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @CheckAbilities({ action: Action.Delete, subject: Entities.Category })
  @ApiNoContentResponse({})
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @CheckAbilities({ action: Action.Update, subject: Entities.Category })
  @ApiOkResponse({ type: Category })
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.recover(id);
  }
}
