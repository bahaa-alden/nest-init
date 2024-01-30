import { PaginatedResponse } from '../../../../common/types';
import { CreateStoreDto, UpdateStoreDto } from '../../dtos';
import { Store } from '../../entities/store.entity';

export interface IStoresService {
  create(dto: CreateStoreDto): Promise<Store>;

  find(ids?: string[]): Promise<PaginatedResponse<Store> | Store[]>;

  findOne(id: string, withDeleted?: boolean): Promise<Store>;

  update(id: string, dto: UpdateStoreDto): Promise<Store>;

  recover(id: string): Promise<Store>;

  remove(id: string): Promise<void>;
}
