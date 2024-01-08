import { Injectable } from '@nestjs/common';
import { City } from '../../cities';
import { Store, CreateStoreDto, UpdateStoreDto } from '..';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class StoreRepository extends Repository<Store> {
  constructor(private readonly dataSource: DataSource) {
    super(Store, dataSource.createEntityManager());
  }

  async createOne(dto: CreateStoreDto, city: City) {
    const store = this.create(dto);
    store.city = city;
    await this.insert(store);
    return store;
  }

  async findById(id: string, withDeleted = false) {
    return this.findOne({
      where: { id },
      withDeleted,
      relations: { city: true },
    });
  }
  async updateOne(store: Store, dto: UpdateStoreDto) {
    store.name = dto.name;
    store.address = dto.address;
    store.city.id = dto.cityId;
    await store.save();
    return this.findById(store.id);
  }
}
