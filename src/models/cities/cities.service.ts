import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dtos';
import { UpdateCityDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
  ) {}
  async create(dto: CreateCityDto) {
    const city = this.cityRepository.create(dto);
    await this.cityRepository.insert(city);
    return city;
  }

  findAll() {
    return this.cityRepository.find();
  }

  async findOne(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });
    if (!city) throw new NotFoundException('city not found');
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const city = await this.findOne(id);
    Object.assign(city, dto);
    city.save();
    return city;
  }

  async recover(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['stores'],
    });
    return this.cityRepository.recover(city);
  }

  async remove(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['stores'],
    });
    return this.cityRepository.softRemove(city);
  }
}
