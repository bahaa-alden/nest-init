import { InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { User } from '../../models/users';
import { Action, Entities } from '../../common/enums';
import { Category } from '../../models/categories';
import { City } from '../../models/cities';
import { Comment } from '../../models/comments';
import { Coupon } from '../../models/coupons';
import { Employee } from '../../models/employees';
import { Permission } from '../../models/permissions';
import { Product } from '../../models/products';
import { Role } from '../../models/roles';
import { Store } from '../../models/stores';
import { Admin } from '../../models/admins';

export interface RequiredRole {
  action: Action;
  subject: Subjects;
}
export type Subjects =
  | InferSubjects<
      | typeof Admin
      | typeof Category
      | typeof City
      | typeof Comment
      | typeof Coupon
      | typeof Employee
      | typeof Permission
      | typeof Product
      | typeof Role
      | typeof Store
      | typeof User
    >
  | Entities
  | 'all';
export type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;
