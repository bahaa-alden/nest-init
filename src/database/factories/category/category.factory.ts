import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../../../models/categories';

export const categoryFactory = setSeederFactory(Category, (faker) =>
  Category.create({
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
  }),
);
