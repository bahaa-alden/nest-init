import { InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { User } from '../../models/users';
import { Action, Entities } from '../../common/enums';

export interface RequiredRole {
  action: Action;
  subject: Subjects;
}
export type Subjects = InferSubjects<typeof User> | Entities | 'all';
export type AppAbility = MongoAbility<[Action, Subjects], MongoQuery>;
