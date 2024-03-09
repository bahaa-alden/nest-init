import { Repository } from 'typeorm';
import { Entities } from '../enums';

export class BaseAuthRepo<Entity> {
  constructor(private readonly repository: Repository<Entity>) {}
  async validate(id: string): Promise<Entity> {
    const qb = this.repository
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id })
      .select([
        'entity.id',
        'entity.name',
        'entity.email',
        'entity.passwordChangedAt',
        'entity.password',
        'entity.createdAt',
        'entity.updatedAt',
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.action',
        'permissions.subject',
      ])
      .leftJoin('entity.role', 'role')
      .leftJoin('role.permissions', 'permissions')

      .leftJoinAndSelect('entity.photos', 'photos');
    if (this.repository.metadata.name === Entities.User) {
      qb.leftJoin('entity.wallet', 'wallet')
        .leftJoin('entity.favoriteCategories', 'favoriteCategories')
        .leftJoin('entity.favoriteCities', 'favoriteCities');

      qb.addSelect([
        'favoriteCategories.id',
        'favoriteCategories.name',
        'favoriteCities.id',
        'favoriteCities.name',
        'wallet.id',
        'wallet.total',
        'wallet.pending',
        'entity.twoFactorAuthenticationSecret',
        'entity.isTwoFactorAuthenticationEnabled',
      ]);
    }
    if (this.repository.metadata.name === Entities.Employee) {
      qb.leftJoinAndSelect('entity.store', 'store').leftJoinAndSelect(
        'store.city',
        'city',
      );
    }
    const person = await qb.getOne();
    return person;
  }
  async findOneById(id: string, withDeleted = false): Promise<Entity> {
    const qb = this.repository
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id })
      .select([
        'entity.id',
        'entity.name',
        'entity.email',
        'entity.passwordChangedAt',
        'entity.createdAt',
        'entity.updatedAt',
        'entity.password',
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.action',
        'permissions.subject',
      ])
      .leftJoin('entity.role', 'role')
      .leftJoin('role.permissions', 'permissions')
      .leftJoinAndSelect('entity.photos', 'photos');

    if (this.repository.metadata.name === Entities.User) {
      qb.leftJoin('entity.wallet', 'wallet')
        .leftJoin('entity.favoriteCategories', 'favoriteCategories')
        .leftJoin('entity.favoriteCities', 'favoriteCities');

      qb.addSelect([
        'favoriteCategories.id',
        'favoriteCategories.name',
        'favoriteCities.id',
        'favoriteCities.name',
        'wallet.id',
        'wallet.total',
        'wallet.pending',
        'entity.twoFactorAuthenticationSecret',
        'entity.isTwoFactorAuthenticationEnabled',
      ]);
    }

    if (this.repository.metadata.name === Entities.Employee) {
      qb.leftJoinAndSelect('entity.store', 'store').leftJoinAndSelect(
        'store.city',
        'city',
      );
    }

    if (withDeleted) qb.withDeleted();

    const person = await qb.getOne();

    return person;
  }

  async findOneByEmail(email: string, withDeleted = false): Promise<Entity> {
    const qb = this.repository
      .createQueryBuilder('entity')
      .where('entity.email = :email', { email })
      .select([
        'entity.id',
        'entity.name',
        'entity.email',
        'entity.passwordChangedAt',
        'entity.createdAt',
        'entity.updatedAt',
        'entity.password',
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.action',
        'permissions.subject',
      ])
      .leftJoin('entity.role', 'role')
      .leftJoin('role.permissions', 'permissions')
      .leftJoinAndSelect('entity.photos', 'photos');

    if (this.repository.metadata.name === Entities.User) {
      qb.leftJoin('entity.wallet', 'wallet')
        .leftJoin('entity.favoriteCategories', 'favoriteCategories')
        .leftJoin('entity.favoriteCities', 'favoriteCities');

      qb.addSelect([
        'favoriteCategories.id',
        'favoriteCategories.name',
        'favoriteCities.id',
        'favoriteCities.name',
        'wallet.id',
        'wallet.total',
        'wallet.pending',
        'entity.twoFactorAuthenticationSecret',
        'entity.isTwoFactorAuthenticationEnabled',
      ]);
    }

    if (this.repository.metadata.name === Entities.Employee) {
      qb.leftJoinAndSelect('entity.store', 'store').leftJoinAndSelect(
        'store.city',
        'city',
      );
    }

    if (withDeleted) qb.withDeleted();

    const person = await qb.getOne();

    return person;
  }
}
