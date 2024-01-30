import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto, UpdateStoreDto } from '../dtos';
import { item_not_found } from '../../../common/constants';
import { Entities } from '../../../common/enums';
import { ICityRepository } from '../../cities/interfaces/repositories/city.repository.interface';
import { CITY_TYPES } from '../../cities/interfaces/type';
import { STORE_TYPES } from '../interfaces/type';
import { IStoreRepository } from '../interfaces/repositories/store.repository.interface';
import { IStoresService } from '../interfaces/services/stores.service.interface';

@Injectable()
export class StoresService implements IStoresService {
  constructor(
    @Inject(STORE_TYPES.repository) private storeRepository: IStoreRepository,
    @Inject(CITY_TYPES.repository) private cityRepository: ICityRepository,
  ) {}
  async create(dto: CreateStoreDto) {
    const city = await this.cityRepository.findOneById(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
    return this.storeRepository.create(dto, city);
  }

  find() {
    return this.storeRepository.find();
  }

  async findOne(id: string, withDeleted = false) {
    const store = await this.storeRepository.findOneById(id, withDeleted);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    return store;
  }

  async update(id: string, dto: UpdateStoreDto) {
    const city = await this.cityRepository.findOneById(dto.cityId);
    if (!city) throw new NotFoundException(item_not_found(Entities.City));
    const store = await this.findOne(id);
    const updateStore = await this.storeRepository.update(store, dto);
    return updateStore;
  }

  async recover(id: string) {
    const store = await this.findOne(id, true);
    await this.storeRepository.recover(store);
    return store;
  }

  async remove(id: string) {
    const store = await this.storeRepository.findOneByIdWithProducts(id);
    if (!store) throw new NotFoundException(item_not_found(Entities.Store));
    await this.storeRepository.remove(store);
  }
}
