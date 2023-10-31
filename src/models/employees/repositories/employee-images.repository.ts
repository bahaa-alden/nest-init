import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EmployeeImage } from '../entities/employee-image.entity';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';
import { checkIfExist } from '../../../common';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeImagesRepository extends Repository<EmployeeImage> {
  constructor(
    private readonly dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(EmployeeImage, dataSource.createEntityManager());
  }

  async updatePhoto(url: string) {
    if (!url) return;
    const res = await checkIfExist(url);
    const uploaded = await this.cloudinaryService.uploadSingleImage(res);
    const photo = this.create({
      ...uploaded,
    });
    return photo;
  }
}
