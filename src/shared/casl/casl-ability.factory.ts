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
import { User } from '../../models/users/entities/users.entity';
import { Action, Entities } from '../../common/enums';
import { AppAbility, Subjects } from './casl.interface';

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build, rules } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    user.role.permissions.forEach((p) => {
      can(p.action, p.subject);
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
