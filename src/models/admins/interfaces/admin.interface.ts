import { ROLE } from '../../../common';

export type IAdmin = {
  name: string;

  email: string;

  password: string;

  role?: ROLE;
};
