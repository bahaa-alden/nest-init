import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth';
import { CloudinaryModule } from './shared/cloudinary';
import { IsExistConstraint, IsUniqueConstraint } from './common';
import { JwtGuard } from './common';
import { ImagesModule } from './images';
import { ImageCleanupModule } from './jobs/image-cleanup';
import { AdminsModule } from './models/admins/admins.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { RolesModule } from './models/roles/roles.module';
import { UsersModule } from './models/users/users.module';
import { DatabaseModule } from './providers/database';
import { CaslModule } from './shared/casl';
import { Module } from '@nestjs/common';
import { CitiesModule } from './models/cities/cities.module';
import { EmployeesModule } from './models/employees/employees.module';
import { StoresModule } from './models/stores/stores.module';
import { CategoriesModule } from './models/categories/categories.module';
import { ProductsModule } from './models/products/products.module';
// import { PaymentsModule } from './models/payments/payments.module';

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
    EmployeesModule,
    ProductsModule,
    CategoriesModule,
    CitiesModule,
    StoresModule,
    RolesModule,
    PermissionsModule,
    ImagesModule,
    DatabaseModule,
    CaslModule,
    CloudinaryModule,
    ImageCleanupModule,
    // PaymentsModule,
  ],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    IsExistConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
