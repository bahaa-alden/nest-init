import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../models/users';
import { AppAbility, Subjects } from './casl.interface';
import { Action } from '../../common/enums';
import { Comment } from '../../models/comments';
import { Product } from '../../models/products';
import { Coupon } from '../../models/coupons';

@Injectable()
export class CaslAbilityFactory {
  defineAbility(currentUser: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    currentUser.role.permissions.forEach((p) => {
      can(p.action, p.subject);
    });
    can(Action.Update, Comment, { userId: { $eq: currentUser.id } });
    can(Action.Delete, Comment, { userId: { $eq: currentUser.id } });
    can(Action.Update, Product, { userId: { $eq: currentUser.id } });
    can(Action.Delete, Product, { userId: { $eq: currentUser.id } });
    can(Action.Create, Coupon, { proOwnerId: { $eq: currentUser.id } });
    can(Action.Update, Coupon, { proOwnerId: { $eq: currentUser.id } });
    can(Action.Delete, Coupon, { proOwnerId: { $eq: currentUser.id } });
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
