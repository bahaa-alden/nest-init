import { Action, Entities } from '../../../common/enums';
import { Subjects } from '../../../shared/casl/casl.interface';

/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IPermission {
  action: Action;
  subject: Entities;
}
