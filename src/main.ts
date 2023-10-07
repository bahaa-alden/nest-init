import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument, errorsFormat } from './common/helpers';
import { useContainer } from 'class-validator';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    extensions: ['jpg'],
    index: false,
  });
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
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
