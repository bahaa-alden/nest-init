import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';
import { User } from '../../users';
import { CheckAbilities, GetUser } from '../../../common/decorators';
import { Action, Entities } from '../../../common/enums';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CommentsService } from '../services/comments.service';

@ApiTags('Comments')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCreatedResponse({ type: Comment })
  @CheckAbilities({ action: Action.Create, subject: Entities.Comment })
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @ApiOkResponse({ type: Comment, isArray: true })
  @ApiQuery({
    name: 'page',
    allowEmptyValue: false,
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    allowEmptyValue: false,
    example: 10,
    required: false,
  })
  @CheckAbilities({ action: Action.Read, subject: Entities.Comment })
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.commentsService.findAll(page, limit);
  }

  @ApiOkResponse({ type: Comment })
  @CheckAbilities({ action: Action.Read, subject: Entities.Comment })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @ApiOkResponse({ type: Comment })
  @CheckAbilities({ action: Action.Update, subject: Entities.Comment })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.update(id, dto, user);
  }

  @ApiNoContentResponse({ type: Comment })
  @CheckAbilities({ action: Action.Delete, subject: Entities.Comment })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.commentsService.remove(id, user);
  }
}
