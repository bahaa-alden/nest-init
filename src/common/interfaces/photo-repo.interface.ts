export interface IPhotoRepository<T> {
  findById(id: string): Promise<T>;
  removeOne(publicId: string): Promise<T>;
  uploadPhotos(paths: string[]): Promise<T[]>;
}
