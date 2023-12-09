import type { DataSource } from 'typeorm';
import type { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Category } from '../../../models/categories';

export class CategorySeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const categoryFactory = factoryManager.get(Category);
    await categoryFactory.saveMany(10);
  }
}