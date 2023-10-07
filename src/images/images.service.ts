import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  uploadSingle(photo: string, req: Request) {
    const { protocol } = req;
    const host = req.get('Host');
    const fullUrl = protocol + '://' + host + '/';
    return fullUrl + 'images/' + photo;
  }

  uploadMultiple(photos: string[], req: Request) {
    const links = photos.map((e) => this.uploadSingle(e, req));
    return { links };
  }
}
