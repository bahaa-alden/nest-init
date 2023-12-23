import { PaginatedResponse } from '../types';

export interface ICrud<T> {
  create(...n): Promise<T>;
  get(...n): Promise<T[] | PaginatedResponse<T>>;
  getOne(...n): Promise<T>;
  update(...n): Promise<T>;
  remove(...n): Promise<void>;
}

export interface INestedController<T> {
  create(...n): Promise<T>;
  get(...n): Promise<T[] | PaginatedResponse<T>>;
}

export interface IGenericController<T> {
  getOne(...n): Promise<T>;
  update(...n): Promise<T>;
  remove(...n): Promise<void>;
}
export interface IAuthController<T> {
  signup(...n): Promise<T>;
  login(...n): Promise<T>;
  updateMyPassword(...n): Promise<T>;
  forgotPassword(...n): Promise<T>;
  resetPassword(...n): Promise<T>;
}
