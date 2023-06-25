import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        password: '123',
        database: config.get('DB_NAME'),
        username: config.get('DB_USER'),
        entities: [__dirname + 'src/**/*.entity.{js,ts}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
