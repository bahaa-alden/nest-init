import { CloudinaryService } from './../shared/cloudinary/cloudinary.service';
import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ImagesService } from './images.service';
import { SharpPipe } from '../common/pipes';
import { checkIfExist } from '../common/helpers';
import { Public } from '../common/decorators';

@ApiTags('images')
@ApiBearerAuth('token')
@Controller('images')
export class ImagesController {
  constructor(
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  //Upload single image
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload single photo',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['photo'],
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Post('single')
  uploadSingle(
    @UploadedFile(SharpPipe)
    photo: string,
    @Req() req: Request,
  ) {
    return this.imagesService.uploadSingle(photo, req);
  }

  //Upload multiple images
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple photos',
    description: 'Upload up to 3 photos at a time.',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['photos'],
      properties: {
        photos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            title: 'photo',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos' }]))
  @Post('multiple')
  uploadMultiple(
    @UploadedFiles(ParseFilePipe, SharpPipe)
    photos: string[],
    @Req() req: Request,
  ) {
    return this.imagesService.uploadMultiple(photos, req);
  }
}
