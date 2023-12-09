import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import PostgresConfig from '../../../config/database/postgres';
import { AppConfig } from '../../../config/app';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import categoryFactory from '../../../database/factories/category.factory';
import { CategorySeeder } from '../../../database/seeders/category/category.seeder';

@Injectable()
export class PostgresService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(PostgresConfig.KEY)
    private readonly postgresConfig: ConfigType<typeof PostgresConfig>,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // if (this.appConfig.env === 'production') {
    //   return {
    //     type: 'postgres',
    //     url: this.postgresConfig.url,
    //     entities: [__dirname + '/../../../models/**/entities/*.entity.{js,ts}'],
    //     synchronize: true,
    //   };
    // }

    const type: DataSourceOptions['type'] = 'postgres';
    const entities: DataSourceOptions['entities'] = [
      __dirname + '/../../../models/**/entities/*.entity.{js,ts}',
    ];
    const factories: SeederOptions['factories'] = [categoryFactory];
    const seeds: SeederOptions['seeds'] = [CategorySeeder];

    const dataSourceOptions: DataSourceOptions & SeederOptions = {
      type,
      host: this.postgresConfig.host,
      port: this.postgresConfig.port,
      password: this.postgresConfig.password,
      database: this.postgresConfig.database,
      username: this.postgresConfig.username,
      synchronize: true,
      entities,
      factories,
      seeds,
    };

    return dataSourceOptions;
  }
}
