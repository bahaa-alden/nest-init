import { CreateStoreDto, UpdateStoreDto } from '../../dtos';
import { Store } from '../../entities/store.entity';
import { City } from '../../../cities';

export interface IStoreRepository {
  create(dto: CreateStoreDto, city: City): Promise<Store>;
  find(): Promise<Store[]>;
  findOneById(id: string, withDeleted?: boolean): Promise<Store>;
  findOneByIdWithProducts(id: string): Promise<Store>;
  update(store: Store, dto: UpdateStoreDto): Promise<Store>;
  recover(store: Store): Promise<Store>;
  remove(store: Store): Promise<void>;
}
