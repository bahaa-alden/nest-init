import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from '../types';

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Nest js Template',
  description: 'Template',
  version: '1.0',
};

export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'jwt' },
      'token',
    );

  const options = builder.build();
  return SwaggerModule.createDocument(app, options);
}
