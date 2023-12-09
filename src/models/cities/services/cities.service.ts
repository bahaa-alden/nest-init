import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dtos';
import { UpdateCityDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';
import { CityRepository } from '../../../shared/repositories/city';

@Injectable()
export class CitiesService {
  constructor(private cityRepository: CityRepository) {}
  async create(dto: CreateCityDto) {
    const city = this.cityRepository.create(dto);
    await this.cityRepository.insert(city);
    return city;
  }

  findAll() {
    return this.cityRepository.find();
  }

  async findOne(id: string, withDeleted?: boolean, relations?: string[]) {
    const city = await this.cityRepository.findById(id, withDeleted, relations);
    if (!city) throw new NotFoundException('city not found');
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.findOne(id);
    return this.cityRepository.updateOne(city, dto);
  }

  async recover(id: string) {
    const city = await this.findOne(id, true, ['stores']);
    return city.recover();
  }

  async remove(id: string) {
    const city = await this.findOne(id, false, ['stores']);
    return city.softRemove();
  }
}
