import { ROLE } from '../../../common';

export type IUser = {
  name: string;

  email: string;

  password: string;

  role?: ROLE;
};
