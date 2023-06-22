import { Model, Document } from 'mongoose';

export interface IUser {
  name: string;
  photo: string;
  email: string;
  role: string;
  password: string;
}
export interface UserDoc extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string, dtoPassword: string): Promise<boolean>;
}

export type UserModel = Model<UserDoc, object, any>;
