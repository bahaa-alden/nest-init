import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';

export const multerOptions: MulterOptions = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else
      cb(
        new BadRequestException('Not an image! Please upload only images.'),
        false,
      );
  },
  limits: { fileSize: 10485760 },
};

// diskStorage({
//   destination: join('public', 'images'),
//   filename: (req, file, cb) => {
//     const randomName = Array(32)
//       .fill(null)
//       .map(() => Math.round(Math.random() * 16).toString(16))
//       .join('');
//     return cb(null, `${randomName}${extname(file.originalname)}`);
//   },
// }),
