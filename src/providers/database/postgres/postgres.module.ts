import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { ConfigModule } from '@nestjs/config';
import postgresConfig from '../../../config/database/postgres/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresService,
      imports: [ConfigModule.forFeature(postgresConfig)],
    }),
  ],
  providers: [],
})
export class PostgresModule {}
