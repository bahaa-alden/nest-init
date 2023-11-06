import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from '../dtos';
import { CitiesService } from '../../cities/services/cities.service';
import { StoreRepository } from '../../../shared/repositories';

@Injectable()
export class StoresService {
  constructor(
    private storeRepository: StoreRepository,
    private citiesService: CitiesService,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.citiesService.findOne(dto.cityId);
    return this.storeRepository.createOne(dto, city);
  }

  findAll() {
    return this.storeRepository.find();
  }

  async findOne(id: string, withDeleted = false) {
    const store = await this.storeRepository.findById(id, withDeleted);
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    await this.citiesService.findOne(dto.cityId);
    const store = await this.findOne(id);
    const updateStore = await this.storeRepository.updateOne(store, dto);
    return updateStore;
  }

  async recover(id: string) {
    const store = await this.findOne(id, true);
    await store.recover();
    return store;
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    return store.softRemove();
  }
}
