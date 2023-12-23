import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from '../dtos';
import { StoreRepository } from '../../../shared/repositories/store';
import { CityRepository } from '../../../shared/repositories/city';

@Injectable()
export class StoresService {
  constructor(
    private storeRepository: StoreRepository,
    private cityRepository: CityRepository,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.cityRepository.findById(dto.cityId);
    if (!city) throw new NotFoundException('city not found');
    return this.storeRepository.createOne(dto, city);
  }

  get() {
    return this.storeRepository.find();
  }

  async getOne(id: string, withDeleted = false) {
    const store = await this.storeRepository.findById(id, withDeleted);
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    const city = await this.cityRepository.findById(dto.cityId);
    if (!city) throw new NotFoundException('city not found');
    const store = await this.getOne(id);
    const updateStore = await this.storeRepository.updateOne(store, dto);
    return updateStore;
  }

  async recover(id: string) {
    const store = await this.getOne(id, true);
    await store.recover();
    return store;
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    await store.softRemove();
    return;
  }
}
