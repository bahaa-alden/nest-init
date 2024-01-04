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
  SerializeOptions,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { UpdateCommentDto } from '../dtos/update-comment.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';
import { User } from '../../users';
import { CheckAbilities, GetUser } from '../../../common/decorators';
import { Action, Entities, GROUPS } from '../../../common/enums';
import { CaslAbilitiesGuard } from '../../../common/guards';
import { CommentsService } from '../services/comments.service';
import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import {
  IGenericController,
  INestedController,
} from '../../../common/interfaces';
import { denied_error } from '../../../common/constants';

@ApiTags('Comments')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: 'Data Not found' })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'products/:productId/comments', version: '1' })
export class CommentsController implements INestedController<Comment> {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCreatedResponse({ type: Comment })
  @CheckAbilities({ action: Action.Create, subject: Entities.Comment })
  @SerializeOptions({ groups: [GROUPS.COMMENT] })
  @Post()
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.create(productId, user, dto);
  }

  @ApiOkResponse({ type: PaginatedResponse<Comment> })
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
  @SerializeOptions({ groups: [GROUPS.ALL_COMMENTS] })
  @Get()
  get(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentsService.get(productId, page, limit);
  }
}

@ApiTags('Comments')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'comments', version: '1' })
export class GenericCommentsController implements IGenericController<Comment> {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOkResponse({ type: Comment })
  @CheckAbilities({ action: Action.Read, subject: Entities.Comment })
  @SerializeOptions({ groups: [GROUPS.COMMENT] })
  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.getOne(id);
  }

  @ApiOkResponse({ type: Comment })
  @CheckAbilities({ action: Action.Update, subject: Entities.Comment })
  @SerializeOptions({ groups: [GROUPS.COMMENT] })
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
  @SerializeOptions({ groups: [GROUPS.COMMENT] })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.commentsService.remove(id, user);
  }
}
