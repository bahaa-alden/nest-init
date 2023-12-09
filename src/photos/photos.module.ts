import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer';
import { PhotosService } from './photos.service';

@Module({
  imports: [MulterModule.register(multerOptions)],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
