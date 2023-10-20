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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';
import { CaslAbilitiesGuard } from '../../common/guards';
import { CheckAbilities } from '../../common/decorators';
import { Action, Entities } from '../../common/enums';

@ApiTags('Categories')
@UseGuards(CaslAbilitiesGuard)
@CheckAbilities({ action: Action.Manage, subject: Entities.Category })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): any {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Post(':id/recover')
  recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.recover(id);
  }
}
