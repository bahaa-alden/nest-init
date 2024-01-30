import { Injectable } from '@nestjs/common';
import { City } from '../../cities';
import { Store, CreateStoreDto, UpdateStoreDto } from '..';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IStoreRepository } from '../interfaces/repositories/store.repository.interface';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto, city: City): Promise<Store> {
    const store = this.storeRepo.create(dto);
    store.city = city;
    await this.storeRepo.insert(store);
    return store;
  }

  async find(): Promise<Store[]> {
    return this.storeRepo.find();
  }

  async findOneById(id: string, withDeleted = false): Promise<Store> {
    return this.storeRepo.findOne({
      where: { id },
      withDeleted,
      relations: { city: true },
    });
  }

  async findOneByIdWithProducts(id: string): Promise<Store> {
    const qb = this.storeRepo.createQueryBuilder('store');
    // Left join with Product where is_paid is false
    qb.leftJoinAndSelect(
      'store.products',
      'product',
      'product.is_paid = :isPaid',
      { isPaid: false },
    );
    // Add additional conditions if needed, e.g., filtering by store ID
    qb.where('store.id = :id', { id });
    const store = await qb.getOne();
    return store;
  }

  async update(store: Store, dto: UpdateStoreDto): Promise<Store> {
    store.name = dto.name;
    store.address = dto.address;
    store.city.id = dto.cityId;
    await store.save();
    return this.findOneById(store.id);
  }

  async recover(store: Store): Promise<Store> {
    await this.storeRepo.recover(store);
    return store;
  }

  async remove(store: Store): Promise<void> {
    await this.storeRepo.softRemove(store);
  }
}
