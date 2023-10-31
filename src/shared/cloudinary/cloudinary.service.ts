import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigType } from '@nestjs/config';
import { CheckUrl, IImage } from '../../common';
import { CloudinaryConfig } from '../../config/app';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CloudinaryConfig.KEY)
    private readonly cloudinaryConfig: ConfigType<typeof CloudinaryConfig>,
  ) {
    cloudinary.v2.config({
      cloud_name: this.cloudinaryConfig.cloud_name,
      api_key: this.cloudinaryConfig.api_key,
      api_secret: this.cloudinaryConfig.api_secret,
    });
  }
  async uploadImage(path: string): Promise<cloudinary.UploadApiResponse> {
    const result = cloudinary.v2.uploader.upload(
      path,
      {
        folder: 'Users',
      },
      (err) => {
        if (err) throw new HttpException(err.message, err.http_code);
      },
    );

    return result;
  }

  async FormatImage(
    result: cloudinary.UploadApiResponse,
    blurHash: string,
  ): Promise<IImage> {
    const mobileUrl = cloudinary.v2.url(result.public_id, {
      secure: true,
      transformation: ['mobile'],
    });

    const profileUrl = cloudinary.v2.url(result.public_id, {
      secure: true,
      transformation: ['profile'],
    });

    return {
      blurHash,
      webUrl: result.secure_url,
      mobileUrl,
      profileUrl,
      publicId: result.public_id,
    };
  }

  async uploadSingleImage({ path, blurHash }: CheckUrl) {
    const result = await this.uploadImage(path);
    return this.FormatImage(result, blurHash);
  }

  async uploadMultipleImages(res: CheckUrl[]) {
    const results = await Promise.all(res.map((e) => this.uploadImage(e.path)));
    return Promise.all(
      results.map((e, index: number) =>
        this.FormatImage(e, res[index].blurHash),
      ),
    );
  }
}
