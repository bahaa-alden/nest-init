import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from '../dtos';
import { StoreRepository } from './../repositories';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { CityRepository } from '../../cities/repositories';

@Injectable()
export class StoresService {
  constructor(
    private storeRepository: StoreRepository,
    private cityRepository: CityRepository,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.cityRepository.findById(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
    return this.storeRepository.createOne(dto, city);
  }

  get() {
    return this.storeRepository.find();
  }

  async getOne(id: string, withDeleted = false) {
    const store = await this.storeRepository.findById(id, withDeleted);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    const city = await this.cityRepository.findById(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
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
      where: { id, products: { is_paid: false } },
      withDeleted: true,
      relations: { products: true },
    });
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    await store.softRemove();
    return;
  }
}
