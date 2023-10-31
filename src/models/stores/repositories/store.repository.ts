import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { UpdateStoreDto, CreateStoreDto } from '../dtos';
import { City } from 'src/models/cities';

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
    Object.assign(store, {
      city: { id: dto.cityId },
      name: dto.name,
      address: dto.address,
    });
    await store.save();
    return this.findById(store.id);
  }
}
