import { Action, Entities } from '../../../common';

/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IPermission {
  action: Action;
  subject: Entities;
}
