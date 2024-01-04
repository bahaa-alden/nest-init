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
import { Category } from '../entities/category.entity';
import { ICrud } from '../../../common/interfaces';
import { denied_error } from '../../../common/constants';

@ApiTags('Categories')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoriesController implements ICrud<Category> {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreatedResponse({ type: Category })
  @CheckAbilities({ action: Action.Create, subject: Entities.Category })
  @Post()
  create(@Body() dto: CreateCategoryDto): any {
    return this.categoriesService.create(dto);
  }

  @ApiOkResponse({ type: Category, isArray: true })
  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @Get()
  get() {
    return this.categoriesService.get();
  }

  @ApiOkResponse({ type: Category })
  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getOne(id);
  }

  @ApiOkResponse({ type: Category })
  @CheckAbilities({ action: Action.Update, subject: Entities.Category })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @ApiNoContentResponse({})
  @CheckAbilities({ action: Action.Delete, subject: Entities.Category })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @ApiOkResponse({ type: Category })
  @CheckAbilities({ action: Action.Update, subject: Entities.Category })
  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.recover(id);
  }
}
