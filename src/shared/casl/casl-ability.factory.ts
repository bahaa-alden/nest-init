import {
  AbilityBuilder,
  AbilityTuple,
  AnyAbility,
  AnyMongoAbility,
  ExtractSubjectType,
  MongoAbility,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../models/users';
import { AppAbility, Subjects } from './casl.interface';

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    user.role.permissions.forEach((p) => {
      can(p.action, p.subject);
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
