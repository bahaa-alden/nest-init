import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigType, ConfigService } from '@nestjs/config';
import postgresConfig from '../../../config/database/postgres';

@Injectable()
export class PostgresService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(postgresConfig.KEY)
    private readonly pgConfig: ConfigType<typeof postgresConfig>,
    private readonly configService: ConfigService,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    if (this.configService.get('ENV') === 'production') {
      return {
        type: 'postgres',
        url: this.pgConfig.url,
        ssl: true,
        entities: [__dirname + '/../../../models/**/entities/*.entity.{js,ts}'],
        synchronize: true,
      };
    }

    return {
      type: 'postgres',
      host: this.pgConfig.host,
      port: this.pgConfig.port,
      password: this.pgConfig.password,
      database: this.pgConfig.database,
      username: this.pgConfig.username,
      entities: [__dirname + '/../../../models/**/entities/*.entity.{js,ts}'],
      synchronize: true,
    };
  }
}
