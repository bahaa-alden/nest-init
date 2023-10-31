import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer';
import { ImagesService } from './images.service';

@Module({
  imports: [MulterModule.register(multerOptions)],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
