import type { DataSource } from 'typeorm';
import type { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Category } from '../../../models/categories';

export class CategorySeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const categoryFactory = factoryManager.get(Category);
    const categories = await categoryFactory.saveMany(3);
    console.log('Complete seeding categories,count: ' + categories.length);
  }
}
