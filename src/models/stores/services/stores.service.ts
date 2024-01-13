import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from '../dtos';
import { StoreRepository } from './../repositories/store.repository';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { ICityRepository } from '../../cities/interfaces/repositories/city.repository.interface';
import { CITY_TYPES } from '../../cities/interfaces/type';

@Injectable()
export class StoresService {
  constructor(
    private storeRepository: StoreRepository,
    @Inject(CITY_TYPES.repository) private cityRepository: ICityRepository,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.cityRepository.findOne(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
    return this.storeRepository.create(dto, city);
  }

  find() {
    return this.storeRepository.find();
  }

  async findOne(id: string, withDeleted = false) {
    const store = await this.storeRepository.findOne(id, withDeleted);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    const city = await this.cityRepository.findOne(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
    const store = await this.findOne(id);
    const updateStore = await this.storeRepository.update(store, dto);
    return updateStore;
  }

  async recover(id: string) {
    const store = await this.findOne(id, true);
    await store.recover();
    return store;
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOneStoreWithProducts(id);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    await store.softRemove();
    return;
  }
}
