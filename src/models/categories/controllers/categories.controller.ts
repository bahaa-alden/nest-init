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
  Inject,
} from '@nestjs/common';
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
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { ICategoriesService } from '../interfaces/services/categories.service.interface';
import { CATEGORY_TYPES } from '../interfaces/type';

@ApiTags('Categories')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoriesController implements ICrud<Category> {
  constructor(
    @Inject(CATEGORY_TYPES.service)
    private readonly categoriesService: ICategoriesService,
  ) {}

  @ApiCreatedResponse({ type: Category })
  @CheckAbilities({ action: Action.Create, subject: Entities.Category })
  @Post()
  create(@Body() dto: CreateCategoryDto): any {
    return this.categoriesService.create(dto);
  }

  @ApiOkResponse({ type: Category, isArray: true })
  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @Get()
  find() {
    return this.categoriesService.find();
  }

  @ApiOkResponse({ type: Category })
  @CheckAbilities({ action: Action.Read, subject: Entities.Category })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
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
