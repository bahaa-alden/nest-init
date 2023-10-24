import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument, errorsFormat } from './common';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppConfig } from './config/app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  const appConfig: ConfigType<typeof AppConfig> = app
    .get(ConfigService)
    .get('application');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    extensions: ['jpg'],
    index: false,
  });
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter, appConfig));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors) => {
        errorsFormat(errors);
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api', app, createDocument(app));
  await app.listen(3000);
}
bootstrap();
