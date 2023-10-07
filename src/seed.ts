import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './database/seeders';
import { SeederModule } from './database/seeders';

async function bootstrap() {
  await NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
