import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dtos';
import { UpdateCityDto } from '../dtos';
import { City } from '../entities/city.entity';
import { CityRepository } from '../../../shared/repositories/city';
import { ICrud } from '../../../common/interfaces';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';

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

  async getOne(id: string, withDeleted?: boolean) {
    const city = await this.cityRepository.findById(id, withDeleted);
    if (!city) throw new NotFoundException(item_not_found(Entities.Category));
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.getOne(id);
    return this.cityRepository.updateOne(city, dto);
  }

  async recover(id: string) {
    const city = await this.cityRepository.findForDeleteById(id, true);
    if (!city) throw new NotFoundException(item_not_found(Entities.Category));
    return city.recover();
  }

  async remove(id: string) {
    const city = await this.cityRepository.findForDeleteById(id);
    if (!city) throw new NotFoundException(item_not_found(Entities.Category));
    await city.softRemove();
    return;
  }
}
