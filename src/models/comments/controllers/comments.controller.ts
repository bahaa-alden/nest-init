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
  Inject,
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
import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import {
  IGenericController,
  INestedController,
} from '../../../common/interfaces';
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { ICommentsService } from '../interfaces/services/comments.service.interface';
import { COMMENT_TYPES } from '../interfaces/type';

@ApiTags('Comments')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'products/:productId/comments', version: '1' })
export class CommentsController implements INestedController<Comment> {
  constructor(
    @Inject(COMMENT_TYPES.service)
    private readonly commentsService: ICommentsService,
  ) {}

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
  find(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentsService.find(productId, page, limit);
  }
}

@ApiTags('Comments')
@ApiBearerAuth('token')
@UseGuards(CaslAbilitiesGuard)
@Controller({ path: 'comments', version: '1' })
export class GenericCommentsController implements IGenericController<Comment> {
  constructor(
    @Inject(COMMENT_TYPES.service)
    private readonly commentsService: ICommentsService,
  ) {}

  @ApiOkResponse({ type: Comment })
  @CheckAbilities({ action: Action.Read, subject: Entities.Comment })
  @SerializeOptions({ groups: [GROUPS.COMMENT] })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
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
