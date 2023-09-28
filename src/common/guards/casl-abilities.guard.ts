import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@casl/ability';
import { CaslAbilityFactory } from '../../shared/casl/casl-ability.factory';
import { CHECK_ABILITY } from '../decorators/metadata';
import { User } from '../../models/users/entities/users.entity';
import { RequiredRole } from '../../shared/casl/casl.interface';

@Injectable()
export class CaslAbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rules =
      this.reflector.getAllAndOverride<RequiredRole[]>(CHECK_ABILITY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    const { user }: { user: User } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.defineAbility(user);
    rules.forEach((rule) =>
      ForbiddenError.from(ability)
        .setMessage('You can not perform this action')
        .throwUnlessCan(rule.action, rule.subject),
    );
    return true;
  }
}
