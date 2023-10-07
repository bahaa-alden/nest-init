import { BadRequestException } from '@nestjs/common';
import { encode } from 'blurhash';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { CheckUrl } from '../types';

export const checkIfExist = async (photo: string): Promise<CheckUrl> => {
  const dir = photo.substring(photo.indexOf('/images'));
  const path = `public${dir}`;

  if (!fs.existsSync(path)) {
    throw new BadRequestException('image not found');
  }
  const image = fs.readFileSync(path);
  const { info, data } = await sharp(image)
    .resize(200, 200)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blurHash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  );

  return { path, blurHash };
};
