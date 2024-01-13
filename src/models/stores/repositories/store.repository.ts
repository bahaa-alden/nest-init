import { Injectable } from '@nestjs/common';
import { City } from '../../cities';
import { Store, CreateStoreDto, UpdateStoreDto } from '..';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto, city: City) {
    const store = this.storeRepo.create(dto);
    store.city = city;
    await this.storeRepo.insert(store);
    return store;
  }

  async find() {
    return this.storeRepo.find();
  }
  async findOne(id: string, withDeleted = false) {
    return this.storeRepo.findOne({
      where: { id },
      withDeleted,
      relations: { city: true },
    });
  }

  async findOneStoreWithProducts(id: string) {
    return this.storeRepo.findOne({
      where: { id, products: { is_paid: false } },
      withDeleted: true,
      relations: { products: true },
    });
  }

  async update(store: Store, dto: UpdateStoreDto) {
    store.name = dto.name;
    store.address = dto.address;
    store.city.id = dto.cityId;
    await store.save();
    return this.findOne(store.id);
  }
}
