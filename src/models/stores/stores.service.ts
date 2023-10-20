import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CitiesService } from '../cities/cities.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private citiesService: CitiesService,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.citiesService.findOne(dto.cityId);
    const store = this.storeRepository.create(dto);
    store.city = city;
    await this.storeRepository.save(store);
    return store;
  }

  findAll() {
    return this.storeRepository.find();
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    const store = await this.findOne(id);
    if (dto.cityId) {
      const city = await this.citiesService.findOne(dto.cityId);
      store.city = city;
    }
    Object.assign(store, {
      name: dto.name,
      address: dto.address,
    });
    store.save();
    return store;
  }

  async recover(id: string) {
    const store = await this.findOne(id);
    return this.storeRepository.recover(store);
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    return this.storeRepository.softRemove(store);
  }
}
