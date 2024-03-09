import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './shared/cloudinary';
import {
  IsExistConstraint,
  IsPhotoExistConstraint,
  IsUniqueConstraint,
} from './common/decorators';
import { JwtGuard } from './common/guards';
import { PhotosModule } from './photos/photos.module';
import { PhotoCleanupModule } from './jobs/photo-cleanup';
import { AdminsModule } from './models/admins/admins.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { RolesModule } from './models/roles/roles.module';
import { UsersModule } from './models/users/users.module';
import { DatabaseModule } from './providers/database';
import { CaslModule } from './shared/casl';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CitiesModule } from './models/cities/cities.module';
import { EmployeesModule } from './models/employees/employees.module';
import { StoresModule } from './models/stores/stores.module';
import { CategoriesModule } from './models/categories/categories.module';
import { ProductsModule } from './models/products/products.module';
import { JwtTokenModule } from './shared/jwt';
import { CouponsModule } from './models/coupons/coupons.module';
import { CommentsModule } from './models/comments/comments.module';
import { ProductPhotosModule } from './models/product-photos/product-photos.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { RedisStoreModule } from './shared/redis-store/redis-store.module';
import { LoggerMiddleware } from './common/middlewares';
import { LoggerModule } from './shared/logger/logger.module';
import { PaymentsModule } from './models/payments/payments.module';
import { Auth2faModule } from './auth-2fa/auth-2fa.module';

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

    DevtoolsModule.register({ http: process.env.ENV !== 'production' }),
    AuthModule,
    Auth2faModule,
    AdminsModule,
    UsersModule,
    EmployeesModule,
    ProductsModule,
    ProductPhotosModule,
    CommentsModule,
    CouponsModule,
    CategoriesModule,
    CitiesModule,
    StoresModule,
    RolesModule,
    PermissionsModule,
    PhotosModule,
    DatabaseModule,
    JwtTokenModule,
    PhotoCleanupModule,
    CaslModule,
    CloudinaryModule,
    RedisStoreModule,
    LoggerModule,
    PaymentsModule,
  ],
  providers: [
    IsUniqueConstraint,
    IsExistConstraint,
    IsPhotoExistConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
