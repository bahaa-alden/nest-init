import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth';
import { CloudinaryModule } from './shared/cloudinary';
import { IsUniqueConstraint } from './common/decorators';
import { JwtGuard } from './common/guards';
import { ImagesModule } from './images';
import { ImageCleanupModule } from './jobs/image-cleanup';
import { AdminsModule } from './models/admins/admins.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { RolesModule } from './models/roles/roles.module';
import { UsersModule } from './models/users/users.module';
import { DatabaseModule } from './providers/database';
import { CaslModule } from './shared/casl';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRES_IN: Joi.string(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASS: Joi.string().required(),
        POSTGRES_NAME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
      }),
      // load: [postgresConfig],
    }),
    AuthModule,
    UsersModule,
    AdminsModule,
    CaslModule,
    DatabaseModule,
    RolesModule,
    PermissionsModule,
    ImagesModule,
    CloudinaryModule,
    ImageCleanupModule,
  ],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
