import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dtos';
import { UpdateCityDto } from '../dtos';
import { City } from '../entities/city.entity';
import { CityRepository } from '../../../shared/repositories/city';
import { ICrud } from '../../../common/interfaces';

@Injectable()
export class CitiesService implements ICrud<City> {
  constructor(private cityRepository: CityRepository) {}
  async create(dto: CreateCityDto) {
    const city = this.cityRepository.create(dto);
    await this.cityRepository.insert(city);
    return city;
  }

  get() {
    return this.cityRepository.find();
  }

  async getOne(id: string, withDeleted?: boolean, relations?: string[]) {
    const city = await this.cityRepository.findById(id, withDeleted, relations);
    if (!city) throw new NotFoundException('city not found');
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.getOne(id);
    return this.cityRepository.updateOne(city, dto);
  }

  async recover(id: string) {
    const city = await this.getOne(id, true, ['stores']);
    return city.recover();
  }

  async remove(id: string) {
    const city = await this.getOne(id, false, ['stores']);
    await city.softRemove();
    return;
  }
}
