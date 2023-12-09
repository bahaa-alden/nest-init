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
    const { can, build, cannot } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    currentUser.role.permissions.forEach((p) => {
      can(p.action, p.subject);
    });
    cannot(Action.Update, Comment, { userId: { $ne: currentUser.id } });
    cannot(Action.Delete, Comment, { userId: { $ne: currentUser.id } });
    cannot(Action.Update, Product, { userId: { $ne: currentUser.id } });
    cannot(Action.Delete, Product, { userId: { $ne: currentUser.id } });
    cannot(Action.Create, Coupon, { proOwnerId: { $ne: currentUser.id } });
    cannot(Action.Update, Coupon, { proOwnerId: { $ne: currentUser.id } });
    cannot(Action.Delete, Coupon, { proOwnerId: { $ne: currentUser.id } });
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
