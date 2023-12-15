import { setSeederFactory } from 'typeorm-extension';
import { City } from '../../../models/cities';
import { Store } from '../../../models/stores';
import { Faker } from '@faker-js/faker';

const stores = (faker: Faker) => {
  const stores = [];
  for (let index = 0; index < 2; index++) {
    stores.push(
      Store.create({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
      }),
    );
  }
  return stores;
};
export const cityFactory = setSeederFactory(City, (faker) =>
  City.create({
    name: faker.location.city(),
    stores: stores(faker),
  }),
);
