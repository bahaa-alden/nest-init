import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      password: this.config.get('DB_PASS'),
      database: this.config.get('DB_NAME'),
      username: this.config.get('DB_USER'),
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
    };
  }
}
