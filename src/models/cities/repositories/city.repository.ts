import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { UpdateCityDto } from '../dtos';

@Injectable()
export class CityRepository extends Repository<City> {
  constructor(private readonly dataSource: DataSource) {
    super(City, dataSource.createEntityManager());
  }

  async findById(id: string, withDeleted = false, relations = []) {
    return this.findOne({
      where: { id },
      withDeleted,
      relations,
    });
  }

  async updateOne(city: City, dto: UpdateCityDto) {
    Object.assign(city, dto);
    await city.save();
    return this.findById(city.id);
  }
}
