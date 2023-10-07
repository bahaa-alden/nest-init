import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer';
import { ImagesService } from './images.service';
import { CloudinaryModule } from '../shared/cloudinary';

@Module({
  imports: [MulterModule.register(multerOptions), CloudinaryModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
