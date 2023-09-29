import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './models/users/users.module';
import * as Joi from '@hapi/joi';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from './shared/casl/casl.module';
import { DatabaseModule } from './providers/database/database.module';
import { AdminsModule } from './models/admins/admins.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { RolesModule } from './models/roles/roles.module';
import { IsUniqueConstraint } from './common/decorators/validations';

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
  ],
  controllers: [],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
