export interface IPhotoRepository<T> {
  findAll(productId: string): Promise<T[]>;
  findById(id: string, relations?: string[]): Promise<T>;
  removeOne(photo: T): Promise<void>;
  uploadPhotos(paths: string[]): Promise<T[]>;
}
