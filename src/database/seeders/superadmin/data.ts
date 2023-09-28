import { IUser } from './../../../models/users/interfaces/users.interface';
import { ROLE } from '../../../common/enums';

export const superadmin: IUser = {
  name: 'super',
  email: 'super@dev.io',
  password: 'test1234',
};
