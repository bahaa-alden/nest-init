import { Action, ROLE } from '../../../common/enums';
import { IPermission } from '../../../models/permissions/interfaces/permissions.interface';

export const roles: any[] = [
  { name: ROLE.USER },
  { name: ROLE.SUPER_ADMIN },
  { name: ROLE.ADMIN },
  { name: ROLE.EMPLOYEE },
];
